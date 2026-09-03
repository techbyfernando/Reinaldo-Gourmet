"""Browser regression checks. Run against the built local site; never submits real messages.

Install tests/requirements.txt, start the existing local server, then run this file.
RQ_TEST_BROWSER=chrome (installed Chrome), firefox or webkit (Playwright browsers).
"""
import datetime
import os
from pathlib import Path
import unittest
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('RQ_TEST_URL', 'http://127.0.0.1:4173/')
ENGINE = os.environ.get('RQ_TEST_BROWSER', 'chrome')
ARTIFACTS = Path('.tools/browser-checks') / ENGINE


class SiteBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if urlparse(BASE).hostname not in ('localhost', '127.0.0.1'):
            raise RuntimeError('These interaction tests are restricted to the local preview.')
        ARTIFACTS.mkdir(parents=True, exist_ok=True)
        cls.runtime = sync_playwright().start()
        kind = cls.runtime.chromium if ENGINE == 'chrome' else getattr(cls.runtime, ENGINE)
        cls.browser = kind.launch(headless=True, **({'channel': 'chrome'} if ENGINE == 'chrome' else {}))

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.runtime.stop()

    def setUp(self):
        self.contexts = []

    def tearDown(self):
        for context in self.contexts:
            context.close()

    def page(self, width=1440, theme='dark', reduced=False, clock=False, javascript=True):
        context = self.browser.new_context(
            viewport={'width': width, 'height': 900 if width > 700 else 844},
            reduced_motion='reduce' if reduced else 'no-preference', java_script_enabled=javascript,
            color_scheme=theme,
        )
        self.contexts.append(context)
        page = context.new_page()
        page.set_default_timeout(8000)
        page.add_init_script(f"localStorage.setItem('rq-theme', '{theme}')")
        if clock:
            start = datetime.datetime(2026, 9, 2, 12, tzinfo=datetime.timezone.utc)
            page.clock.install(time=start)
            page.clock.pause_at(start + datetime.timedelta(seconds=1))
        return page

    def load(self, page, fragment=''):
        page.goto(BASE.rstrip('/') + '/' + fragment, wait_until='domcontentloaded')

    def visible_content(self, page):
        expect(page.locator('#hero-title')).to_be_visible()
        cta = page.locator('.hero .button-primary')
        expect(cta).to_be_visible()
        self.assertTrue(cta.evaluate("el => { const r=el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)); }"))
        self.assertFalse(page.evaluate('document.documentElement.scrollWidth > innerWidth'))

    def initial_view(self, width, theme):
        page = self.page(width=width, theme=theme, clock=True)
        self.load(page)
        self.visible_content(page)
        self.assertIsNone(page.locator('html').get_attribute('data-arrival'))
        self.assertEqual(page.locator('.hero-poster').evaluate('el => getComputedStyle(el).clipPath'), 'none')
        self.assertEqual(page.locator('[data-hero-media]').count(), 0)
        page.screenshot(path=str(ARTIFACTS / f'{theme}-{width}-restored.png'))
        page.clock.run_for(1800)
        self.visible_content(page)

    def test_01_desktop_direct_arrival(self):
        self.initial_view(1440, 'dark')

    def test_02_mobile_light_direct_arrival(self):
        self.initial_view(390, 'light')

    def test_03_cta_is_immediately_interactive(self):
        page = self.page(clock=True)
        self.load(page)
        box = page.locator('.hero .button-primary').bounding_box()
        page.mouse.click(box['x'] + box['width']/2, box['y'] + box['height']/2)
        page.clock.run_for(1600)
        self.assertEqual(urlparse(page.url).fragment, 'contato')
        page.wait_for_function("document.activeElement === document.querySelector('#contato h2')")

    def test_04_missing_smoother_keeps_native_navigation(self):
        page = self.page()
        page.route('**/lenis.min.js*', lambda route: route.abort())
        self.load(page)
        self.visible_content(page)
        self.assertNotEqual(page.locator('html').get_attribute('data-scroll-mode'), 'smooth')
        page.locator('.hero .button-primary').click()
        self.assertEqual(urlparse(page.url).fragment, 'contato')

    def test_05_reduced_motion_and_data_saver(self):
        for setting in ('reduced', 'data'):
            with self.subTest(setting=setting):
                page = self.page(reduced=setting == 'reduced')
                if setting == 'data':
                    page.add_init_script("Object.defineProperty(navigator, 'connection', {value: {saveData: true}})")
                self.load(page)
                self.visible_content(page)
                self.assertNotEqual(page.locator('html').get_attribute('data-arrival'), 'playing')
                self.assertEqual(page.locator('.hero-poster').evaluate('el => getComputedStyle(el).clipPath'), 'none')
                self.assertIsNone(page.locator('video').get_attribute('src'))
        page = self.page(clock=True)
        self.load(page)
        page.emulate_media(reduced_motion='reduce')
        self.assertIsNone(page.locator('html').get_attribute('data-arrival'))
        expect(page.locator('html')).to_have_attribute('data-scroll-mode', 'native')

    def test_06_native_without_javascript(self):
        page = self.page(width=390, javascript=False)
        self.load(page)
        self.visible_content(page)
        self.assertEqual(page.locator('.hero-poster').evaluate('el => getComputedStyle(el).clipPath'), 'none')
        page.locator('.hero .button-primary').click()
        self.assertEqual(urlparse(page.url).fragment, 'contato')

    def test_07_navigation_form_and_history(self):
        page = self.page(width=390)
        self.load(page, '#experiencia')
        self.assertNotEqual(page.locator('html').get_attribute('data-arrival'), 'playing')
        page.get_by_role('button', name='Abrir menu', exact=True).click()
        page.locator('#mobile-menu').get_by_role('link', name='Cardapios', exact=True).click()
        expect(page.locator('#mobile-menu')).to_be_hidden()
        page.wait_for_function("document.activeElement === document.querySelector('#cardapios h2')")
        page.get_by_role('link', name='Planejar churrasco ou feijoada', exact=True).click()
        page.wait_for_function("document.activeElement === document.querySelector('input[name=nome]')")
        expect(page.locator('select[name=tipo]')).to_have_value('Eventos Particulares')
        expect(page.locator('select[name=menu]')).to_have_value('Churrasco')
        self.assertGreater(page.locator('input[name=nome]').bounding_box()['y'], 94)
        page.get_by_role('combobox', name='Tipo de evento', exact=True).select_option('Eventos Corporativos')
        page.get_by_role('textbox', name='Um detalhe importante (opcional)', exact=True).fill('Teste local, sem envio.')
        page.go_back(wait_until='domcontentloaded')
        page.wait_for_function("location.hash === '#cardapios'")
        self.assertNotEqual(page.locator('html').get_attribute('data-arrival'), 'playing')
        page.go_forward(wait_until='domcontentloaded')
        page.wait_for_function("location.hash === '#contato'")

    def test_08_responsive_and_theme_matrix(self):
        page = self.page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        self.load(page)
        self.assertIsNone(page.locator('html').get_attribute('data-arrival'))
        for theme in ('dark', 'light'):
            if theme == 'light':
                page.get_by_role('button', name='Ativar tema claro', exact=True).click()
            for width in (320,390,768,1024,1440,1920):
                with self.subTest(theme=theme,width=width):
                    page.set_viewport_size({'width': width, 'height': 900})
                    self.visible_content(page)
                    self.assertEqual(page.locator('html').get_attribute('data-theme'), theme)
        self.assertEqual(errors, [])

    def test_09_video_carousel_and_keyboard(self):
        page = self.page()
        self.load(page)
        page.wait_for_function("document.querySelector('video').currentTime > 0")
        self.assertTrue(page.locator('video').evaluate('el => el.muted && el.loop && !el.controls'))
        page.get_by_role('link', name='Conhecer a experiência', exact=True).click()
        page.wait_for_function("document.activeElement === document.querySelector('#experiencia h2')")
        viewport = page.locator('[data-carousel-viewport]')
        viewport.scroll_into_view_if_needed()
        viewport.hover()
        page.wait_for_function("document.querySelector('[data-carousel]').dataset.moving === 'true'")
        before = page.locator('[data-carousel-track]').get_attribute('style')
        page.wait_for_function("old => document.querySelector('[data-carousel-track]').getAttribute('style') !== old", arg=before)
        page.get_by_role('button', name='Proxima foto', exact=True).click()
        self.assertEqual(page.get_by_role('button', name='Pausar', exact=False).count(), 0)
        before_y = page.evaluate('scrollY')
        page.keyboard.press('PageDown')
        page.wait_for_function('previous => scrollY > previous', arg=before_y)
        page.locator('.faq-list details:first-child summary').click()
        expect(page.locator('.faq-list details[open]')).to_have_count(1)

    def test_10_delayed_smoother_does_not_hide_content(self):
        page = self.page(clock=True)
        held = []
        page.route('**/lenis.min.js*', lambda route: held.append(route))
        page.goto(BASE, wait_until='commit')
        self.visible_content(page)
        self.assertEqual(page.locator('.hero-poster').evaluate('el => getComputedStyle(el).clipPath'), 'none')
        for route in held:
            route.continue_()
        expect(page.locator('html')).to_have_attribute('data-scroll-mode', 'smooth')

    def test_11_fonts_and_resources_are_local(self):
        page = self.page()
        requests, failures = [], []
        page.on('request', lambda request: requests.append(request.url))
        page.on('requestfailed', lambda request: failures.append(request.url))
        self.load(page)
        page.evaluate('document.fonts.ready')
        self.assertTrue(page.evaluate('document.fonts.check("500 32px Cormorant Garamond")'))
        self.assertTrue(page.evaluate('document.fonts.check("400 16px Manrope")'))
        # This Windows host injects its antivirus into Chrome. Leave that protection
        # untouched and distinguish its traffic from the site's own dependencies.
        def device_security(url):
            return (urlparse(url).hostname or '').endswith('.kaspersky-labs.com')
        external = [urlparse(url).hostname for url in requests
                    if urlparse(url).hostname not in ('127.0.0.1','localhost') and not device_security(url)]
        self.assertFalse(external)
        self.assertFalse([url for url in requests if 'gsap' in url or 'hero-arrival' in url])
        self.assertFalse([url for url in failures if not device_security(url)])

    def test_12_wheel_momentum_settles_and_reverses(self):
        page = self.page()
        self.load(page)
        expect(page.locator('html')).to_have_attribute('data-scroll-mode', 'smooth')
        page.mouse.move(1100, 500)
        page.mouse.wheel(0, 600)
        page.wait_for_function('scrollY >= 598')
        end = page.evaluate('scrollY')
        self.assertAlmostEqual(end, 600, delta=2)
        page.mouse.wheel(0, -300)
        page.wait_for_function('scrollY <= 302')
        self.assertAlmostEqual(page.evaluate('scrollY'), 300, delta=2)


    def test_13_svg_icons_in_both_themes(self):
        page = self.page(width=390)
        self.load(page)
        for theme in ('dark', 'light'):
            if theme == 'light':
                page.locator('[data-theme-toggle]').click()
            active = 'sun' if theme == 'dark' else 'moon'
            inactive = 'moon' if theme == 'dark' else 'sun'
            expect(page.locator(f'[data-icon-{active}]')).to_be_visible()
            expect(page.locator(f'[data-icon-{inactive}]')).to_be_hidden()
            icons = page.locator('.ui-icon')
            self.assertGreater(icons.count(), 20)
            self.assertTrue(icons.evaluate_all("els => els.every(el => el.namespaceURI === 'http://www.w3.org/2000/svg' && el.getAttribute('aria-hidden') === 'true')"))
            page.screenshot(path=str(ARTIFACTS / f'icons-{theme}-390.png'), animations='disabled')

    def test_14_form_rules_and_whatsapp_payload(self):
        page = self.page(reduced=True)
        self.load(page, '#contato')
        form = page.locator('#event-form')
        self.assertFalse(form.evaluate('el => el.checkValidity()'))
        name = page.locator('[name=nome]')
        city = page.locator('[name=cidade]')
        guests = page.locator('[name=convidados]')
        date = page.locator('[name=data]')
        name.fill('Maria & João')
        city.fill('São Paulo')
        guests.fill('30')
        self.assertTrue(form.evaluate('el => el.checkValidity()'))
        for field in (name, city):
            original = field.input_value()
            field.fill('   ')
            self.assertFalse(field.evaluate('el => el.checkValidity()'))
            field.fill(original)
        for invalid in ('0', '-1', '1.5'):
            guests.fill(invalid)
            self.assertFalse(guests.evaluate('el => el.checkValidity()'))
        guests.fill('30')
        date.fill('2000-01-01')
        self.assertFalse(date.evaluate('el => el.checkValidity()'))
        date.fill(date.get_attribute('min'))
        self.assertTrue(date.evaluate('el => el.checkValidity()'))
        date.fill('')
        self.assertEqual(page.locator('[name=tipo] option').all_text_contents(), ['Eventos Particulares', 'Eventos Corporativos'])
        captured = []
        page.route('https://wa.me/**', lambda route: (captured.append(route.request.url), route.fulfill(status=200, body='Local test: no message sent')))
        page.locator('[name=tipo]').select_option('Eventos Corporativos')
        page.locator('[name=menu]').select_option('Feijoada')
        page.locator('[name=detalhes]').fill('Sem amendoim & sem leite')
        form.locator('button[type=submit]').click()
        page.wait_for_url('https://wa.me/**')
        from urllib.parse import parse_qs
        self.assertEqual(len(captured), 1)
        target = urlparse(captured[0])
        self.assertEqual(target.path, '/5511940197460')
        message = parse_qs(target.query)['text'][0]
        for value in ('Maria & João', 'São Paulo', '30', 'a definir', 'Eventos Corporativos', 'Feijoada', 'Sem amendoim & sem leite'):
            self.assertIn(value, message)



if __name__ == '__main__':
    unittest.main(verbosity=2)

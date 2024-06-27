# Fast Form Filler

Instantly Fill Forms with Realistic Data for Seamless Testing

Are you tired of wasting precious time and mental energy coming up with random data when testing forms? Say goodbye to that hassle with Fake Data Generator - your go-to Chrome extension for lightning-fast form filling!

## 🚀 Boost Your Productivity

Transform your testing process from tedious to effortless. With just a simple keyboard shortcut, generate high-quality fake data in seconds.

### 🎯 Perfect for:

- Web developers
- QA testers
- UX researchers
- Anyone who frequently deals with online forms

### ✨ Key Features:

- **One-Click Wonder:** Press Cmd+K (Mac) or Ctrl+K (Windows/Linux) to summon the magic!
- **Diverse Data Types:** From names and emails to addresses and dates - we've got you covered.
- **Context-Aware:** Intelligently inserts data where your cursor is placed.
- **Realistic Output:** Generate believable, varied data for authentic testing scenarios.

### 💡 How It Works:

1. Click on any input field
2. Press Cmd+K or Ctrl+K
3. Choose your desired data type
4. Watch as realistic data instantly appears in your form

### 🛠 Perfect for Testing:

- Registration forms
- Checkout processes
- User profiles
- And any other data-hungry forms!

## 💼 Professional Grade, User-Friendly Design

Crafted with care for professionals but simple enough for anyone to use. Streamline your workflow and say goodbye to "John Doe" and "test@test.com" forever!

## Download

[Download Fast Form Filler from the Chrome Web Store](https://chromewebstore.google.com/detail/fast-form-filler/fodkgenpkjgddegddggkboogdnmjcdgj?authuser=0&hl=en)

## Setup

Add a `.env` file with the following content:

```env
INLINE_RUNTIME_CHUNK=false
```



# Getting Started

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).


First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

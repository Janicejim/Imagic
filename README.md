# Imagic

A SaaS platform for AI image modification that enables users to purchase credits, allowing them to access services such as
photo filling, background removal, image recoloring and object removal.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage ](#usage)

## 🌟 Features

- Feature 1: Subscribe packages and purchase credits via Stripe 💳
- Feature 2: Image filling ✍️
- Feature 3: Image object remove 🚮
- Feature 1: Image remove background 🧼
- Feature 2: Image recolor 🎨



## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Janicejim/Imagic.git
   ```

2. Install packages:
   ``` bash
   yarn 
   ```
4. Create .env.local and paste value:
   ```
   // .env.local
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
    # for clerk:
    WEBHOOK_SECRET=
    MONGODB_URL=
    VERCEL_DOMAIN=
    DB_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    NEXT_PUBLIC_SERVER_URL=
   ```

5. Need create clerk,cloudinary and stripe account for auth, ai and payment. After that, paste the related api key in .env.local file.



## 🛠 Usage
   ```bash
   yarn dev
   ```

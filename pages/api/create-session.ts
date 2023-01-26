import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

async function CreateStripeSession(req: NextApiRequest, res: NextApiResponse) {
  type Item = {
    item: {
      image: string
      name: string
      price: number
      description: string
      quantity: number
    }
  }
  const { item } = req.body as Item

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  })

  const redirectURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://stripe-checkout-next-js-demo.vercel.app"

  const transformedItem = {
    price_data: {
      currency: "usd",
      product_data: {
        images: [item.image],
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    description: item.description,
    quantity: item.quantity,
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [transformedItem],
    mode: "payment",
    success_url: redirectURL + "?status=success",
    cancel_url: redirectURL + "?status=cancel",
    metadata: {
      images: item.image,
    },
  })

  res.json({ id: session.id })
}

export default CreateStripeSession

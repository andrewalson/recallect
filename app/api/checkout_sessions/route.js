import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

export async function POST(req) {
  const { subscriptionLevel } = await req.json();

  let amount;
  if (subscriptionLevel === "price_basic") {
    amount = 5;
  } else if (subscriptionLevel === "price_pro") {
    amount = 10;
  } else {
    console.log(
      NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    );
  }

  try {
    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                subscriptionLevel === "price_basic"
                  ? "Basic Subscription"
                  : "Pro Subscription",
            },
            unit_amount: formatAmountForStripe(
              subscriptionLevel === "price_basic" ? 5 : 10,
              "usd"
            ),
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get(
        "origin"
      )}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        "origin"
      )}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    console.log("Created session:", checkoutSession);

    return NextResponse.json(checkoutSession, {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new NextResponse(
      JSON.stringify({ error: { message: error.message } }),
      {
        status: 500,
      }
    );
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  try {
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}

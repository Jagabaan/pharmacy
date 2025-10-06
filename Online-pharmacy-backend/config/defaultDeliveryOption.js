import { DeliveryOption } from "../model/deliveryOptionModel.js";

export const seedDeliveryOptions = async () => {
  try {
    const existing = await DeliveryOption.find();

    if (existing.length > 0) {
      console.log('✅ Delivery options already exist. Skipping seed.');
      return;
    }

    const deliveryOptions = [
      { deliveryDays: 7, priceCents: 0 },
      { deliveryDays: 3, priceCents: 150000 },
      { deliveryDays: 1, priceCents: 300000 }
    ];

    await DeliveryOption.insertMany(deliveryOptions);
    console.log('✅ Delivery options seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding delivery options:', err.message);
  }
};

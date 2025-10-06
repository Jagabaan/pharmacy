import { DeliveryOption } from "../model/deliveryOptionModel.js";
import dayjs from 'dayjs';

export const deliveryOptions = async (req, res) => {
  try {
    const options = await DeliveryOption.find({});
    
    if (options.length === 0) {
      return res.status(404).json({ message: 'No delivery options found' });
    }

    const enrichedOptions = options.map(option => {
      return {
        _id: option._id,
        id: option.id,
        deliveryDays: option.deliveryDays,
        priceCents: option.priceCents,
        deliveryDate: dayjs().add(option.deliveryDays, 'day').toDate() 
      };
    });

    res.status(200).json(enrichedOptions);
  } catch (error) {
    console.error('Error fetching delivery options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

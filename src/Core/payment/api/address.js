import { updateUser } from '../../users'

export const updateUserShippingAddress = async (userID, shippingAddress) => {
  try {
    updateUser(userID, {
      shippingAddress,
    })
    return { success: true }
  } catch (error) {
    return { error, success: false }
  }
}

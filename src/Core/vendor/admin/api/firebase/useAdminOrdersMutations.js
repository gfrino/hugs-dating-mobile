import { deleteOrder as deleteOrderAPI } from './AdminOrderClient'

const useAdminOrdersMutations = () => {
  const deleteOrder = orderID => {
    return deleteOrderAPI(orderID)
  }
  return { deleteOrder }
}

export default useAdminOrdersMutations

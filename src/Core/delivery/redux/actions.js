import IMCartActionsConstants from './types'

export const updateOrders = data => ({
  type: IMCartActionsConstants.UPDATE_ORDERS,
  data,
})

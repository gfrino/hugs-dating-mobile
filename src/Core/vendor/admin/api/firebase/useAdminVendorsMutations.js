import { addVendor as addVendorAPI } from './AdminVendorClient'
import { useVendorConfig } from '../../hooks/useVendorAdminConfig'

const useAdminVendorsMutations = () => {
  const { config } = useVendorConfig()

  const addVendor = newVendor => {
    return addVendorAPI(config.tables?.vendorsTableName, newVendor)
  }
  return { addVendor }
}

export default useAdminVendorsMutations

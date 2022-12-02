import 'react-redux'
import { Store } from '~/types'
declare module 'react-redux' {
  interface DefaultRootState extends Store {}
}

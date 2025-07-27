import { VendorDocument } from '../../model/Vendor';
import { CustomerDocument } from '../../model/Customer'; 
// Update this path to your interface

declare global {
  namespace Express {
    interface Request {
      customer?: CustomerDocument;
      vendor?: VendorDocument;
    }
  }
}
export{};
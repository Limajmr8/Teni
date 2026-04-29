import SellerApprovalRow from '@/components/sellers/seller-approval-row';

export default function SellersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Seller approvals</h1>
      <SellerApprovalRow name="Aunty Imtisunep" village="Mopungchuket" />
      <SellerApprovalRow name="Ao Shawl House" village="Longkong" />
    </div>
  );
}

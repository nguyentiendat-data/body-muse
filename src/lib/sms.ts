export async function sendSms(phone: string, text: string): Promise<void> {
  // TODO: gắn nhà cung cấp SMS, dùng khóa từ biến môi trường; không log số/mã.
  void phone; void text;
  throw new Error("Dịch vụ SMS chưa được cấu hình.");
}

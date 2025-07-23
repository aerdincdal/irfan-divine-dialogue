export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center glow-text">
          Gizlilik Politikası
        </h1>
        
        <div className="glass-panel p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">1. Veri Toplama</h2>
            <p className="text-muted-foreground leading-relaxed">
              İrfan uygulaması, size daha iyi hizmet verebilmek için minimum düzeyde kişisel veri toplar. 
              Toplanan veriler sadece e-posta adresiniz ve sohbet geçmişinizdir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">2. Veri Kullanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Toplanan veriler sadece uygulama içi deneyiminizi kişiselleştirmek ve 
              İslami bilgiler hizmetini sunmak için kullanılır. Verileriniz üçüncü taraflarla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">3. Veri Güvenliği</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tüm verileriniz şifrelenerek saklanır ve en yüksek güvenlik standartlarıyla korunur. 
              Verilerinize yetkisiz erişim engellenmiştir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">4. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Gizlilik politikamız hakkında sorularınız için iletişime geçebilirsiniz: 
              <span className="text-primary"> privacy@irfan.app</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
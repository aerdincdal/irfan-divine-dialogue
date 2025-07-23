export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center glow-text">
          Kullanım Şartları
        </h1>
        
        <div className="glass-panel p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">1. Hizmet Tanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              İrfan, yapay zeka destekli İslami bilgiler asistanıdır. Uygulama, 
              Kur'an-ı Kerim, hadisler ve İslami ilimler hakkında bilgi sağlar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">2. Kullanım Koşulları</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uygulamamızı kullanırken İslami değerlere uygun davranmanızı, 
              saygılı bir dil kullanmanızı ve hizmetimizi kötüye kullanmamanızı rica ederiz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">3. İçerik Sorumluluğu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uygulama tarafından sağlanan bilgiler referans amaçlıdır. 
              Önemli dini konularda mutlaka uzman din alimlerine danışınız.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">4. Değişiklikler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu kullanım şartları herhangi bir zamanda güncellenebilir. 
              Değişiklikler uygulama içinde duyurulacaktır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
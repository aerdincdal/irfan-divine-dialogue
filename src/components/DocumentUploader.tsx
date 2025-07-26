import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ragService } from "@/services/ragService";
import { Loader2, Upload, FileText } from "lucide-react";

interface DocumentUploaderProps {
  onSuccess?: () => void;
}

export const DocumentUploader = ({ onSuccess }: DocumentUploaderProps) => {
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentText.trim() || !documentName.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen doküman adı ve metni girin.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await ragService.processDocument(documentText, documentName);
      
      toast({
        title: "İşlem Başarılı",
        description: result.message
      });

      // Reset form
      setDocumentText("");
      setDocumentName("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Document processing error:', error);
      toast({
        title: "İşlem Hatası",
        description: error.message || "Doküman işlenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Dini Doküman Yükleme
        </CardTitle>
        <CardDescription>
          Kuran, hadis ve dini metinleri sisteme ekleyerek RAG veritabanını zenginleştirin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="documentName">Doküman Adı</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Örn: Sahih Bukhari - Kitab ul-Iman"
              className="glass-input"
              required
            />
            <p className="text-sm text-muted-foreground">
              Dokümanın kaynak bilgisini açık şekilde belirtin.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentText">Doküman Metni</Label>
            <Textarea
              id="documentText"
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Dini metnin tam içeriğini buraya yapıştırın..."
              className="glass-input min-h-[300px] resize-none"
              required
            />
            <p className="text-sm text-muted-foreground">
              Metin en az 100 karakter olmalıdır. Sistem metni otomatik olarak parçalara bölerek işleyecektir.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">İşleme Notları:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Metin otomatik olarak anlamlı parçalara bölünecektir</li>
              <li>• Her parça için vektör embeddingi oluşturulacaktir</li>
              <li>• Kullanıcı sorularında bu metinler kaynak olarak kullanılacaktır</li>
              <li>• Sadece güvenilir dini kaynakları yükleyin</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isProcessing || !documentText.trim() || !documentName.trim()}
            className="w-full h-12 glass-button"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Dokümanı İşle ve Kaydet
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="text-center text-sm text-muted-foreground">
              Bu işlem doküman boyutuna göre birkaç dakika sürebilir.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
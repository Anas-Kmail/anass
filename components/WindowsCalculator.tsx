import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator, Download, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WindowData {
  id: number;
  length: number;
  width: number;
}

interface CalculationResult {
  windowNumber: number;
  frameLength: number;
  frameWidth: number;
  sashLength: number;
  sashWidth: number;
}

export default function WindowsCalculator() {
  const [numberOfWindows, setNumberOfWindows] = useState<number>(1);
  const [windows, setWindows] = useState<WindowData[]>([
    { id: 1, length: 0, width: 0 },
  ]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const updateNumberOfWindows = (count: number) => {
    if (count < 1) return;

    setNumberOfWindows(count);
    const newWindows: WindowData[] = [];

    for (let i = 0; i < count; i++) {
      const existingWindow = windows[i];
      newWindows.push({
        id: i + 1,
        length: existingWindow?.length || 0,
        width: existingWindow?.width || 0,
      });
    }

    setWindows(newWindows);
    setShowResults(false);
  };

  const updateWindow = (
    id: number,
    field: "length" | "width",
    value: number,
  ) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, [field]: value } : window,
      ),
    );
  };

  const calculateResults = () => {
    const calculations: CalculationResult[] = windows.map((window) => ({
      windowNumber: window.id,
      frameLength: window.length,
      frameWidth: window.width - 2.6,
      sashLength: window.length - 6,
      sashWidth: (window.width - 2.6) / 2,
    }));

    setResults(calculations);
    setShowResults(true);
  };

  const generatePDF = async () => {
    // For now, we'll create a simple downloadable text file
    // In a real app, you'd use a library like jsPDF
    const content = [
      "تقرير حساب النوافذ الألومنيوم",
      "=".repeat(40),
      "",
      ...results
        .map((result, index) => [
          `النافذة رقم: ${result.windowNumber}`,
          `طول الإطار: ${result.frameLength.toFixed(2)} سم`,
          `عرض الإطار: ${result.frameWidth.toFixed(2)} سم`,
          `طول الضلفة: ${result.sashLength.toFixed(2)} سم`,
          `عرض الضلفة: ${result.sashWidth.toFixed(2)} سم`,
          "",
        ])
        .flat(),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "windows-calculation.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-windows-50 to-windows-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-windows-900">
              حاسبة النوافذ الألومنيوم
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أدخل عدد النوافذ وأبعاد كل نافذة لحساب الإطارات والضلف تلقائياً
          </p>
        </div>

        {/* Number of Windows Input */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5 text-primary" />
              عدد النوافذ
            </CardTitle>
            <CardDescription>حدد عدد النوافذ التي تريد حسابها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="windows-count" className="text-base font-medium">
                عدد النوافذ:
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="windows-count"
                  type="number"
                  min="1"
                  max="50"
                  value={numberOfWindows}
                  onChange={(e) =>
                    updateNumberOfWindows(parseInt(e.target.value) || 1)
                  }
                  className="w-24 text-center text-lg font-semibold"
                />
                <Badge variant="secondary" className="text-sm">
                  {numberOfWindows === 1
                    ? "نافذة واحدة"
                    : `${numberOfWindows} نوافذ`}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Windows Input */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">أبعاد النوافذ</CardTitle>
            <CardDescription>
              أدخل الطول والعرض لكل نافذة بالسنتيمتر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {windows.map((window) => (
                <div
                  key={window.id}
                  className="bg-gradient-to-br from-windows-50 to-white p-6 rounded-xl border-2 border-windows-200 animate-fade-in"
                >
                  <h3 className="font-semibold text-lg mb-4 text-windows-900 text-center">
                    النافذة رقم {window.id}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor={`length-${window.id}`}
                        className="text-sm font-medium mb-2 block"
                      >
                        الطول (سم)
                      </Label>
                      <Input
                        id={`length-${window.id}`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={window.length || ""}
                        onChange={(e) =>
                          updateWindow(
                            window.id,
                            "length",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="text-center text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`width-${window.id}`}
                        className="text-sm font-medium mb-2 block"
                      >
                        العرض (سم)
                      </Label>
                      <Input
                        id={`width-${window.id}`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={window.width || ""}
                        onChange={(e) =>
                          updateWindow(
                            window.id,
                            "width",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="text-center text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <Button
            onClick={calculateResults}
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-windows-600 hover:from-windows-600 hover:to-primary shadow-lg"
          >
            <Calculator className="ml-2 h-5 w-5" />
            احسب النتائج
          </Button>
        </div>

        {/* Results Table */}
        {showResults && results.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-windows-900">
                    نتائج الحسابات
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    تفاصيل الإطارات والضلف لجميع النوافذ
                  </CardDescription>
                </div>
                <Button
                  onClick={generatePDF}
                  variant="outline"
                  className="gap-2 hover:bg-primary hover:text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  تحميل PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-windows-50">
                      <TableHead className="text-center font-bold text-windows-900">
                        رقم النافذة
                      </TableHead>
                      <TableHead className="text-center font-bold text-windows-900">
                        طول الإطار (سم)
                      </TableHead>
                      <TableHead className="text-center font-bold text-windows-900">
                        عرض الإطار (سم)
                      </TableHead>
                      <TableHead className="text-center font-bold text-windows-900">
                        طول الضلفة (سم)
                      </TableHead>
                      <TableHead className="text-center font-bold text-windows-900">
                        عرض الضلفة (سم)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow
                        key={result.windowNumber}
                        className="hover:bg-windows-50/50"
                      >
                        <TableCell className="text-center font-semibold text-lg">
                          <Badge
                            variant="outline"
                            className="text-base px-3 py-1"
                          >
                            {result.windowNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-primary">
                          {result.frameLength.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-primary">
                          {result.frameWidth.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-windows-600">
                          {result.sashLength.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-windows-600">
                          {result.sashWidth.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

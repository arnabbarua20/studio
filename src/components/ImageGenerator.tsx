
"use client";

import { useState } from 'react';
import NextImage from 'next/image'; // Renamed to avoid conflict with local Image
import { generateImage, type GenerateImageInput, type GenerateImageOutput } from '@/ai/flows/generate-image-from-text';
import { suggestPromptImprovements, type SuggestPromptImprovementsInput, type SuggestPromptImprovementsOutput } from '@/ai/flows/suggest-prompt-improvements';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FineTuningPanel } from './FineTuningPanel';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Sparkles, Settings, Image as ImageIcon, Download } from 'lucide-react'; 
import { toast } from '@/hooks/use-toast';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      toast({
        title: "Error",
        description: "Prompt cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    // setImageUrl(null); // Clear previous image if desired, or keep it until new one loads

    try {
      const input: GenerateImageInput = { prompt };
      const output: GenerateImageOutput = await generateImage(input);
      setImageUrl(output.imageUrl);
      toast({
        title: "Image Generated!",
        description: "Your masterpiece is ready.",
      });
    } catch (e: any) {
      const errorMessage = e.message || "Failed to generate image. Please try again.";
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestImprovements = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt to get suggestions.");
      toast({
        title: "Error",
        description: "Enter a prompt to get suggestions.",
        variant: "destructive",
      });
      return;
    }
    setIsImprovingPrompt(true);
    setError(null);
    try {
      const input: SuggestPromptImprovementsInput = { prompt };
      const output: SuggestPromptImprovementsOutput = await suggestPromptImprovements(input);
      setPrompt(output.improvedPrompt);
      toast({
        title: "Prompt Improved!",
        description: "The AI has suggested an improved prompt.",
      });
    } catch (e: any) {
      const errorMessage = e.message || "Failed to suggest prompt improvements.";
      setError(errorMessage);
      toast({
        title: "Improvement Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "No image to download.",
        variant: "destructive",
      });
      return;
    }
    const link = document.createElement('a');
    link.href = imageUrl;
    // Suggest a filename for the download
    const fileName = prompt.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 30) || 'generated-image';
    link.download = `${fileName}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download Started",
      description: "Your image is downloading.",
    });
  };

  const imageDisplaySize = 512;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <CardTitle className="text-2xl md:text-3xl font-headline text-center text-foreground">
            Create Your Image
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-1">
            Enter a text prompt and let AI bring your vision to life.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-base font-medium">Your Prompt</Label>
            <Textarea
              id="prompt"
              placeholder=""
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="text-sm resize-none"
              disabled={isLoading || isImprovingPrompt}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <Button
              onClick={handleSuggestImprovements}
              disabled={isLoading || isImprovingPrompt}
              variant="outline"
              className="flex-1 text-accent-foreground border-accent hover:bg-accent/10"
            >
              {isImprovingPrompt ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Improve Prompt
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || isImprovingPrompt}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Image
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 aspect-square w-full max-w-lg mx-auto flex items-center justify-center border border-dashed rounded-lg bg-muted/20 p-2 overflow-hidden">
            {isLoading ? (
              <div className="text-center p-4">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Generating your image...</p>
              </div>
            ) : imageUrl ? (
              <NextImage
                src={imageUrl}
                alt={prompt || "Generated image"}
                width={imageDisplaySize}
                height={imageDisplaySize}
                className="rounded-md object-contain max-h-full max-w-full shadow-md"
                data-ai-hint="generated art"
                unoptimized={imageUrl.startsWith('data:')} // Handle potential base64 images if AI returns that
              />
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2 text-sm">Your generated image will appear here.</p>
              </div>
            )}
          </div>
          {imageUrl && !isLoading && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 border-t">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fine-tuning" className="border-none">
              <AccordionTrigger className="text-base hover:no-underline px-6 py-4 text-foreground data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Fine-Tuning Options (UI Placeholder)
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 bg-muted/10">
                <FineTuningPanel />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </div>
  );
}

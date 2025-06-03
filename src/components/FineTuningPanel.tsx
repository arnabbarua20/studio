"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatasetUploader } from './DatasetUploader';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Settings2 } from 'lucide-react';

export function FineTuningPanel() {
  const [steps, setSteps] = useState<string>("1000");
  const [samplingMethod, setSamplingMethod] = useState<string>('euler_a');
  const [scheduler, setScheduler] = useState<string>('karras');
  const [model, setModel] = useState<string>('sdxl');

  const handleSaveChanges = () => {
    console.log({ steps: parseInt(steps), samplingMethod, scheduler, model });
    toast({
      title: "Settings Saved (Placeholder)",
      description: "Fine-tuning parameters have been logged to console.",
    });
  };

  return (
    <div className="space-y-6 p-1 md:p-2">
      <p className="text-sm text-muted-foreground">
        Adjust parameters for model fine-tuning. Upload your dataset to train a custom model. (UI Placeholder)
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="steps">Training Steps</Label>
          <Input
            id="steps"
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="e.g., 1000"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="samplingMethod">Sampling Method</Label>
          <Select value={samplingMethod} onValueChange={setSamplingMethod}>
            <SelectTrigger id="samplingMethod">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Common Methods</SelectLabel>
                <SelectItem value="euler_a">Euler a</SelectItem>
                <SelectItem value="dpm_2m_karras">DPM++ 2M Karras</SelectItem>
                <SelectItem value="lcm">LCM</SelectItem>
                <SelectItem value="ddim">DDIM</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="scheduler">Scheduler</Label>
          <Select value={scheduler} onValueChange={setScheduler}>
            <SelectTrigger id="scheduler">
              <SelectValue placeholder="Select scheduler" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Schedulers</SelectLabel>
                <SelectItem value="karras">Karras</SelectItem>
                <SelectItem value="exponential">Exponential</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="sgm_uniform">SGM Uniform</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="model">Base Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
                <SelectItem value="sd_1_5">Stable Diffusion 1.5</SelectItem>
                <SelectItem value="custom_model_1">Custom Model 1 (Placeholder)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-4" />
      
      <div>
        <h3 className="text-md font-medium mb-2 text-foreground">Dataset for Fine-Tuning</h3>
        <DatasetUploader />
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleSaveChanges} variant="default">
          <Settings2 className="mr-2 h-4 w-4" />
          Save Fine-Tuning Settings
        </Button>
      </div>
    </div>
  );
}

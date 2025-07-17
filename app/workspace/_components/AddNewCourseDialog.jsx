"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function AddNewCourseDialog({ children }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 1,
    includeVideo: false,
    category: '',
    level: ''
  });

  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onGenerate = async () => {
    const courseId = uuidv4();
    setLoading(true);

    try {
      const result = await axios.post('/api/generate-course-layout', {
        ...formData,
        courseId: courseId
      });

      if (result?.data?.resp?.toLowerCase?.() === 'limit exceed') {
        toast.warning('Please subscribe to a plan!');
        setOpen(false);
        router.push('/workspace/billing');
        return;
      }

      toast.success('Course Generated!');
      setOpen(false);
      router.push('/workspace/edit-course/' + result.data?.courseId);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error("Something went wrong while generating the course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)}>
          {children}
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Course Using AI</DialogTitle>
          <DialogDescription asChild>
            <motion.div
              className='flex flex-col gap-4 mt-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <label className="text-sm font-medium">Course Name</label>
                <Input
                  placeholder="Course Name"
                  onChange={(e) => onHandleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Course Description (optional)</label>
                <Input
                  placeholder="Course Description"
                  onChange={(e) => onHandleInputChange('description', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Number of Chapters</label>
                <Input
                  placeholder="Number of Chapters"
                  type="number"
                  min={1}
                  onChange={(e) => onHandleInputChange('noOfChapters', parseInt(e.target.value))}
                />
              </div>

              <div className='flex gap-3 items-center'>
                <label className="text-sm font-medium">Include Video</label>
                <Switch
                  onCheckedChange={(value) => onHandleInputChange('includeVideo', value)}
                />
              </div>

              <div>
                <label className='text-sm font-medium mb-2'>Difficulty Level</label>
                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="e.g. Technology, Business"
                  onChange={(e) => onHandleInputChange('category', e.target.value)}
                />
              </div>

              <motion.div className='mt-5' whileHover={{ scale: 1.03 }}>
                <Button onClick={onGenerate} className='w-full p-3 cursor-pointer' disabled={loading}>
                  {loading ? (
                    <Loader2Icon className='animate-spin' />
                  ) : (
                    <SparklesIcon />
                  )}
                  <span className='ml-2'>Generate Course</span>
                </Button>
              </motion.div>

            </motion.div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;

'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  // CardContent,
  CardHeader,
  // CardTitle,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

interface ExcelData {
  teammate: string;
  reason: string;
  name: string;
  [key: string]: string | number;
}

export function ExcelReaderWithCardsComponent() {
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData[]>([]);

  console.log('excelData', excelData);

  const readExcelFile = useCallback(() => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setError(null);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const binaryString = evt.target?.result;
        if (typeof binaryString !== 'string') {
          throw new Error('Failed to read file data');
        }

        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws) as ExcelData[];
        console.log('Excel data:', data);
        setExcelData(data);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while processing the file'
        );
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setError('An error occurred while reading the file');
    };

    reader.readAsBinaryString(file);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please upload a valid Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setExcelData([]);
    } else {
      setFile(null);
      setExcelData([]);
    }
  };

  console.log('Excel data:', excelData);

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      {excelData.length === 0 ? (
        <div className="mb-6 mx-auto space-y-4 p-6 bg-white shadow-lg rounded-lg w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[##F7931E] rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200"
          >
            <span className="text-[#F7931E] font-medium">
              📂 Click to upload Excel file
            </span>
            <span className="text-sm text-gray-500">(.xlsx, .xls)</span>
          </label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <Button
            onClick={readExcelFile}
            disabled={!file}
            className={`w-full py-3 font-semibold rounded-lg transition duration-300 ${
              file
                ? 'bg-[#F7931E] text-white hover:bg-[###FFBE7A] shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            📩 Get Messages
          </Button>
        </div>
      ) : null}
      {error && (
        <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {excelData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {excelData.map((item, index) => (
            <Card
              key={index}
              className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col"
            >
              <CardHeader className="bg-gradient-to-r  from-[#F7931E] via-[#FFA94D] to-[#FFBE7A]  text-white p-4">
                <CardTitle className="text-xl font-semibold">
                  {item.Teammate}
                </CardTitle>
              </CardHeader>
              <div className="p-4 flex-grow">
                <p className="text-gray-700 text-lg italic">
                  &quot;
                  {
                    item[
                      Object.keys(item).find((key) =>
                        key.toLowerCase().includes('reason')
                      ) || ''
                    ]
                  }
                  &quot;
                </p>
              </div>
              {item.Photo && (
                <div className="flex justify-center items-center mt-4">
                  <Image
                    src={
                      item.Name === 'Evelin Ortiz'
                        ? '/Eve.jpg'
                        : item.Name === 'Isabel Moreira'
                        ? '/isa.jpeg'
                        : ''
                    }
                    alt="Fran"
                    width={500}
                    height={300}
                  />
                </div>
              )}
              <CardFooter className="bg-gray-300 p-4 flex justify-end">
                <p className="text-sm font-bold text-gray-600">
                  By {item.Name}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {excelData.length > 0 && (
        <Button
          className="bg-[#F7931E] text-white hover:bg-[#FFBE7A] shadow-md px-4 py-2 rounded-md w-full mt-8"
          onClick={() => setExcelData([])}
        >
          Import Again
        </Button>
      )}
    </div>
  );
}

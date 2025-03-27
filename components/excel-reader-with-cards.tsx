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
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-6 text-center text-[#2d41ac] mt-6 ">
          FRAN
        </h1>
        <div className="flex items-center">
          <div className="flex items-center border-4 border-[#8b96ce] rounded-lg">
            <Image
              src="/fran.jpg"
              alt="Fran"
              width={256}
              height={256}
              className="mx-auto"
            />
          </div>
        </div>
        <div className="flex items-center my-10 ">
          <Image
            src="/words.png"
            alt="Fran"
            width={750}
            height={750}
            className="mx-auto"
          />
        </div>
      </div>
      {excelData.length === 0 ? (
        <div className="mb-6 max-w-md mx-auto">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="mb-4 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#8b96ce]"
          />
          <Button
            onClick={readExcelFile}
            disabled={!file}
            className="w-full bg-[#8b96ce] text-white font-semibold rounded-lg hover:bg-[#8b96ce] transition duration-200"
          >
            get Messages
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {excelData.map((item, index) => (
          <Card
            key={index}
            className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col"
          >
            <CardHeader className="bg-gradient-to-r from-[#8b96ce] to-[#7281c8] text-white p-4">
              {/* <CardTitle className="text-xl font-semibold">
                {item.Name}
              </CardTitle> */}
            </CardHeader>
            <div className="p-4 flex-grow">
              <p className="text-gray-700 text-lg italic">
                &quot;
                {
                  item[
                    Object.keys(item).find((key) =>
                      key.toLowerCase().includes('send')
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
              <p className="text-sm font-bold text-gray-600">- {item.Name}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

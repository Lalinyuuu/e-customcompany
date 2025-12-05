'use client';

import { Brain, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const AIExplanationCard = memo(function AIExplanationCard() {
  const t = useTranslations('CompanyForm');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-linear-to-r from-purple-50/30 via-blue-50/30 to-indigo-50/30 dark:from-purple-950/10 dark:via-blue-950/10 dark:to-indigo-950/10">
      <CardHeader
        className="border-b bg-transparent pb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span>{t('ai_explanation_title') || 'AI Auto-Fill ทำงานอย่างไร?'}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-purple-100 dark:border-purple-900/30">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  {t('ai_step_1_title') || 'วิเคราะห์ชื่อบริษัท'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('ai_step_1_desc') ||
                    'ระบบ AI จะวิเคราะห์ชื่อบริษัทที่คุณกรอก (ภาษาไทยหรืออังกฤษ) เพื่อระบุตัวตนของบริษัท'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-blue-100 dark:border-blue-900/30">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  {t('ai_step_2_title') || 'ค้นหาข้อมูลที่อยู่'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('ai_step_2_desc') ||
                    'AI จะค้นหาข้อมูลที่อยู่ของบริษัทจากฐานข้อมูลและแหล่งข้อมูลที่เชื่อถือได้'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-indigo-100 dark:border-indigo-900/30">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  {t('ai_step_3_title') || 'เติมข้อมูลอัตโนมัติ'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('ai_step_3_desc') ||
                    'ระบบจะเติมข้อมูลที่อยู่ทั้งหมด (เลขที่, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์) ให้อัตโนมัติ'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-1">
                  {t('ai_tip_title') || 'เคล็ดลับ'}
                </p>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
                  {t('ai_tip_desc') ||
                    'กรอกชื่อบริษัทให้ถูกต้องและครบถ้วนเพื่อให้ AI ค้นหาข้อมูลได้แม่นยำยิ่งขึ้น'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
});

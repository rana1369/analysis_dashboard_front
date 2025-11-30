import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<Language>(
    (localStorage.getItem('language') as Language) || 'en'
  );
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.loading': 'Loading...',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.noData': 'No data available',

    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.welcome': 'Welcome to Rental Management Dashboard',

    // Brands
    'brands.title': 'Brands Management',
    'brands.add': 'Add Brand',
    'brands.edit': 'Edit Brand',
    'brands.name': 'Brand Name',
    'brands.branchLocation': 'Branch Location',
    'brands.contactPerson': 'Contact Person',
    'brands.contactEmail': 'Contact Email',
    'brands.contactPhone': 'Contact Phone',
    'brands.contractDuration': 'Contract Duration (months)',
    'brands.rentalModel': 'Rental Model',
    'brands.rentalValue': 'Rental Value',
    'brands.notes': 'Notes',
    'brands.documents': 'Documents',
    'brands.description': 'Description',

    // Rentals
    'rentals.title': 'Rentals Management',
    'rentals.add': 'Add Rental',
    'rentals.edit': 'Edit Rental',
    'rentals.sale': 'Add Sales And Rent',
    'rentals.brand': 'Brand',
    'rentals.rentalType': 'Rental Type',
    'rentals.rentalAmount': 'Rental Amount',
    'rentals.percentageValue': 'Percentage Value',
    'rentals.startDate': 'Start Date',
    'rentals.endDate': 'End Date',
    'rentals.renewalDate': 'Renewal Date',
    'rentals.expectedAnnualIncome': 'Expected Annual Income',
    'rentals.contractFiles': 'Contract Files',
    'rentals.unitNumber': 'Unit Number',

    // Financial
    'financial.title': 'Financial Analysis',
    'financial.profitable': 'Profitable',
    
    'financial.losing': 'Losing',
    'financial.breakingEven': 'Breaking Even',
    'financial.totalRevenue': 'Total Annual Rental Revenue',
    'financial.totalBrands': 'Total Brands',
    'financial.totalContracts': 'Total Contracts',
    'financial.averageMargin': 'Average Profit Margin',
    'financial.topProfitable': 'Top Profitable Brands',
    'financial.leastProfitable': 'Least Profitable Brands',
    'financial.rentalTypes': 'Rental Type Comparison',
    'financial.contractsExpiring': 'Contracts Expiring',
    'financial.monthlyRevenue': 'Monthly Revenue',

    // Reports
    'reports.title': 'Reports',
    'reports.generate': 'Generate Report',
    'reports.exportPDF': 'Export to PDF',
    'reports.exportExcel': 'Export to Excel',
    'reports.exportCSV': 'Export to CSV',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.metrics': 'Key Metrics',
    'dashboard.charts': 'Charts & Analytics',

    // Activities
    'activities.title': 'Activities Management',
    'activities.add': 'Add Activity',
    'activities.edit': 'Edit Activity',
    'activities.name': 'Activity Name',
    'activities.description': 'Description',
    'activities.safeValue': 'Safe Value (%)',
    'activities.parentActivity': 'Parent Activity',
    'activities.selectParent': 'Select Parent Activity (Optional)',
    'activities.parentActivityHint': 'Select a parent activity if this is a sub-activity'
  },
  ar: {
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.loading': 'جاري التحميل...',
    'common.confirm': 'تأكيد',
    'common.close': 'إغلاق',
    'common.noData': 'لا توجد بيانات متاحة',

    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.username': 'اسم المستخدم',
    'auth.password': 'كلمة المرور',
    'auth.welcome': 'مرحباً بك في لوحة إدارة الإيجارات',

    // Brands
    'brands.title': 'إدارة العلامات التجارية',
    'brands.add': 'إضافة علامة تجارية',
    'brands.edit': 'تعديل علامة تجارية',
    'brands.name': 'اسم العلامة التجارية',
    'brands.branchLocation': 'موقع الفرع',
    'brands.contactPerson': 'الشخص المسؤول',
    'brands.contactEmail': 'البريد الإلكتروني',
    'brands.contactPhone': 'رقم الهاتف',
    'brands.contractDuration': 'مدة العقد (بالأشهر)',
    'brands.rentalModel': 'نموذج الإيجار',
    'brands.rentalValue': 'قيمة الإيجار',
    'brands.notes': 'ملاحظات',
    'brands.documents': 'المستندات',
    'brands.description': 'الوصف',

    // Rentals
    'rentals.title': 'إدارة الإيجارات',
    'rentals.add': 'إضافة إيجار',
    'rentals.edit': 'تعديل إيجار',
    'rentals.sale': 'إضافة مبيعات وإيجار',
    'rentals.brand': 'العلامة التجارية',
    'rentals.rentalType': 'نوع الإيجار',
    'rentals.rentalAmount': 'مبلغ الإيجار',
    'rentals.percentageValue': 'قيمة النسبة المئوية',
    'rentals.startDate': 'تاريخ البدء',
    'rentals.endDate': 'تاريخ الانتهاء',
    'rentals.renewalDate': 'تاريخ التجديد',
    'rentals.expectedAnnualIncome': 'الدخل السنوي المتوقع',
    'rentals.contractFiles': 'ملفات العقد',
    'rentals.unitNumber': 'رقم الوحدة',

    // Financial
    'financial.title': 'التحليل المالي',
    'financial.profitable': 'ربحي',
    'financial.losing': 'خاسر',
    'financial.breakingEven': 'متعادل',
    'financial.totalRevenue': 'إجمالي إيرادات الإيجار السنوية',
    'financial.totalBrands': 'إجمالي العلامات التجارية',
    'financial.totalContracts': 'إجمالي العقود',
    'financial.averageMargin': 'متوسط هامش الربح',
    'financial.topProfitable': 'أكثر العلامات التجارية ربحية',
    'financial.leastProfitable': 'أقل العلامات التجارية ربحية',
    'financial.rentalTypes': 'مقارنة أنواع الإيجار',
    'financial.contractsExpiring': 'العقود المنتهية',
    'financial.monthlyRevenue': 'الإيرادات الشهرية',

    // Reports
    'reports.title': 'التقارير',
    'reports.generate': 'إنشاء تقرير',
    'reports.exportPDF': 'تصدير إلى PDF',
    'reports.exportExcel': 'تصدير إلى Excel',
    'reports.exportCSV': 'تصدير إلى CSV',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.metrics': 'المقاييس الرئيسية',
    'dashboard.charts': 'الرسوم البيانية والتحليلات',

    // Activities
    'activities.title': 'إدارة الأنشطة',
    'activities.add': 'إضافة نشاط',
    'activities.edit': 'تعديل نشاط',
    'activities.name': 'اسم النشاط',
    'activities.description': 'الوصف',
    'activities.safeValue': 'القيمة الآمنة (%)',
    'activities.parentActivity': 'النشاط الأب',
    'activities.selectParent': 'اختر النشاط الأب (اختياري)',
    'activities.parentActivityHint': 'اختر نشاطاً أباً إذا كان هذا نشاطاً فرعياً'
  }
};


  constructor() {
    this.setLanguage(this.currentLanguageSubject.value);
  }

  setLanguage(lang: Language): void {
    localStorage.setItem('language', lang);
    this.currentLanguageSubject.next(lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  translate(key: string): string {
    const lang = this.currentLanguageSubject.value;
    return this.translations[lang]?.[key] || key;
  }

  getTranslations(): Record<string, string> {
    return this.translations[this.currentLanguageSubject.value];
  }
}


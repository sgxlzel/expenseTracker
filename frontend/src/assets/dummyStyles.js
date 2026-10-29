// assets/dummyStyles.js

export const dashboardStyles = {
  // Layout styles
  container: "min-h-screen p-4 md:p-6",

  // Header styles with shades of blue and purple
  headerContainer: "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-lg border border-white/30 dark:border-indigo-900/40",
  headerContent: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
  headerTitle: "text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-300 dark:via-indigo-200 dark:to-purple-300 bg-clip-text text-transparent",
  headerSubtitle: "text-gray-600 dark:text-slate-300 mt-2",

  // Button styles (blues and purples)
  addButton: "flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20 font-medium",

  // Time frame selector styles
  timeFrameContainer: "flex justify-end mt-4",
  timeFrameWrapper: "flex gap-0 bg-white dark:bg-[#141530] p-1 rounded-xl border border-gray-200 dark:border-[#252752] shadow-sm",
  timeFrameButton: (isActive) =>
    `px-2.5 py-2 text-sm rounded-lg transition-all ${
      isActive
        ?"bg-indigo-600 dark:bg-indigo-600 text-white font-semibold shadow-sm"
        :"text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1f224d]"
    }`,

  // Summary cards grid
  summaryGrid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8",

  // Financial card styles (warm badges)
  balanceBadge: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-transparent dark:border-indigo-800/40 px-2 py-1 rounded-lg text-xs font-medium",
  expenseBadge: "bg-orange-100 dark:bg-amber-950/60 text-orange-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40 px-1 py-1 rounded-lg text-xs font-medium",

  // Gauge container styles
  gaugeGrid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8",

  // Pie chart container styles (blues/purples theme)
  pieChartContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-[#252752] relative overflow-hidden mb-8",
  pieChartHeader: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3",
  pieChartTitle: "text-xl lg:pt-3 xl:pl-3 font-bold text-gray-800 dark:text-slate-100 mb-5 flex items-center gap-3",
  pieChartSubtitle: "text-sm lg:text-center xl:text-start xl:pl-3 text-gray-500 dark:text-slate-300 mb-3",
  pieChartHeight: "h-72 sm:h-80",

  // Pie chart tooltip styles
  tooltipContent: {
    backgroundColor: "rgba(20, 21, 48, 0.95)",
    border: "1px solid #252752",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
    padding: "12px",
  },
  tooltipItem: { fontWeight: 400 },

  // Legend styles
  legendWrapper: { paddingTop: 8 },
  legendText: "text-sm font-medium text-gray-600 dark:text-slate-300",

  // Income/Expense lists grid
  listsGrid: "grid grid-cols-1 gap-6",

  // List container styles
  listContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-[#252752]",
  listHeader: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3",
  listTitle: "text-xl font-bold text-gray-800 dark:text-slate-100 md:mt-3 mt-3 flex items-center gap-3",
  listSubtitle: "text-sm text-gray-500 dark:text-slate-300 font-normal",

  // Record count badges (warm colors)
  incomeCountBadge: "text-sm bg-emerald-100 dark:bg-emerald-950/60 px-2 mx-2 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/40 md:mx-2 md:mt-2 py-1 rounded-full font-medium",
  expenseCountBadge: "text-sm bg-orange-100 dark:bg-amber-950/60 text-orange-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40 px-2 mx-2 md:mx-2 md:mt-2 py-1 rounded-full font-medium",

  // Transaction item styles (warmer tones)
  transactionList: "space-y-3",
  incomeTransactionItem: "flex items-center justify-between p-3 sm:p-4 bg-emerald-50/70 dark:bg-emerald-950/25 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors border border-emerald-100/50 dark:border-emerald-800/30",
  expenseTransactionItem: "flex items-center justify-between p-3 sm:p-4 bg-amber-50/70 dark:bg-amber-950/25 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors border border-amber-100/50 dark:border-amber-800/30",

  // Transaction icon container
  incomeIconContainer: "p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg",
  expenseIconContainer: "p-2 bg-orange-100 dark:bg-amber-950/60 text-orange-700 dark:text-amber-300 rounded-lg",

  // Transaction content (light, high contrast text)
  transactionContent: "flex items-center lg:gap-3 md:gap-3 gap-1",
  transactionDescription: "font-medium text-gray-800 dark:text-slate-100",
  transactionCategory: "text-sm text-gray-500 dark:text-slate-300",
  transactionAmount: "text-right",
  incomeAmount: "font-bold text-emerald-600 dark:text-emerald-400",
  expenseAmount: "font-bold text-orange-600 dark:text-amber-400",
  transactionDate: "text-sm text-gray-500 dark:text-slate-300",

  // Empty state styles
  emptyState: "text-center py-8",
  emptyIconContainer: (color) => `w-16 h-16 mx-auto mb-4 rounded-full ${color} flex items-center justify-center`,
  emptyText: "text-gray-600 dark:text-slate-300 font-medium",

  // View all button styles
  viewAllContainer: "pt-4 border-t border-gray-100 dark:border-[#252752]",
  viewAllButton: "w-full flex items-center justify-center gap-2 py-3 text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-50 dark:hover:bg-[#1a1c42] rounded-xl transition-colors",

  // Icon container styles
  iconContainer: (color) => `p-2 ${color} rounded-lg`,

  // Specific icon colors
  walletIconContainer: "p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg",
  arrowDownIconContainer: "p-2 bg-orange-100 dark:bg-amber-950/60 text-orange-700 dark:text-amber-300 rounded-lg",
  piggyBankIconContainer: "p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-lg",
};

// Additional styles for financial trends
export const trendStyles = {
  positive: "text-orange-600 dark:text-amber-400",
  negative: "text-emerald-600 dark:text-emerald-400",
  positiveRate: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
  negativeRate: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
};

// Chart specific styles
export const chartStyles = {
  pieChart: "text-xs sm:text-sm",
};

export const incomeStyles = {
  // Layout
  wrapper: "space-y-4 md:space-y-6 p-3 md:p-4 max-w-7xl mx-auto",
  headerContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-100 dark:border-[#252752]",
  header: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6",
  headerTitle: "text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white",
  headerSubtitle: "text-gray-600 dark:text-slate-300 mt-1 text-sm md:text-base",
  addButton: "flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm md:text-base",

  // Summary Cards
  summaryGrid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5",

  // Chart
  chartContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-[#252752] mb-6",
  chartTitle: "text-lg md:text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 md:mb-5 flex items-center gap-2 md:gap-3",

  // Transaction List
  listContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-[#252752] relative overflow-hidden",
  sectionTitle: "text-lg md:text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 md:mb-5 flex items-center gap-2 md:gap-3",

  // Filter Section
  filterContainer: "flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto",
  filterSelect: "appearance-none bg-white dark:bg-[#181938] border border-gray-300 dark:border-[#2f3166] text-gray-800 dark:text-slate-100 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full",
  exportButton: "flex items-center justify-center gap-1 bg-white dark:bg-[#181938] border border-gray-300 dark:border-[#2f3166] hover:bg-gray-50 dark:hover:bg-[#20224d] text-gray-700 dark:text-slate-200 px-3 py-2 rounded-lg transition-all text-sm hover:shadow-md w-full sm:w-auto",

  // Transaction Items
  transactionList: "space-y-3",
  viewAllButton: "mt-4 w-full text-center py-3 text-emerald-600 dark:text-emerald-300 font-medium hover:bg-emerald-50 dark:hover:bg-[#1a1c42] rounded-xl transition-colors flex items-center justify-center gap-2",

  // Empty State
  emptyStateContainer: "text-center py-6 md:py-8",
  emptyStateIcon: "w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center",
  emptyStateText: "text-gray-600 dark:text-slate-200 font-medium text-sm md:text-base",
  emptyStateSubtext: "text-xs md:text-sm text-gray-500 dark:text-slate-300 mt-1 md:mt-2",
  emptyStateButton: "mt-3 md:mt-4 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg mx-auto text-sm md:text-base",

  // Time Frame Selector Container
  timeFrameContainer: "flex justify-end mt-4",

  // Chart header container
  chartHeaderContainer: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5",

  // Chart height
  chartHeight: "h-64 sm:h-80",

  // Chart tooltip styles
  tooltipContent: {
    backgroundColor: "rgba(20, 21, 48, 0.95)",
    border: "1px solid #252752",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
    padding: "12px",
    backdropFilter: "blur(4px)",
  },

  // Icon container styles for summary cards
  iconGreen: "p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-lg",
  iconBlue: "p-2 bg-blue-100 dark:bg-blue-950/60 rounded-lg",
  iconPurple: "p-2 bg-purple-100 dark:bg-purple-950/60 rounded-lg",

  // Icon text colors
  textGreen: "text-emerald-600 dark:text-emerald-400",
  textBlue: "text-blue-600 dark:text-blue-400",
  textPurple: "text-purple-600 dark:text-purple-400",

  // Filter icon positioning
  filterIcon: "absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-slate-300 pointer-events-none",

  // FinancialCard border colors
  borderGreen: "border-l-4 border-emerald-500",
  borderBlue: "border-l-4 border-blue-500",
  borderPurple: "border-l-4 border-purple-500",
};

export const expensePageStyles = {
  // Main container
  container: "space-y-6 max-w-7xl",

  // Header card
  headerCard: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-100 dark:border-[#252752]",
  headerContainer: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6",
  headerTitle: "text-2xl md:text-3xl font-bold text-gray-800 dark:text-white",
  headerSubtitle: "text-gray-600 dark:text-slate-300 mt-1",
  addButton: "flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-medium",

  // Financial cards grid
  cardsGrid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5",

  // Chart container
  chartContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-[#252752] mb-6",
  chartHeader: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5",
  chartTitle: "text-xl font-bold text-gray-800 dark:text-slate-100 mb-5 flex items-center gap-3",
  exportButton: "flex items-center gap-1 bg-white dark:bg-[#181938] border border-gray-300 dark:border-[#2f3166] hover:bg-gray-50 dark:hover:bg-[#20224d] text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg transition-all text-sm hover:shadow-md",
  chart: "h-64 sm:h-80",

  // Transactions container
  transactionsContainer: "bg-white dark:bg-[#141530] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-[#252752] relative overflow-hidden",
  transactionsHeader: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-5",
  transactionsTitle: "text-lg md:text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 md:mb-5 flex items-center gap-2 md:gap-3",
  filterSelect: "appearance-none bg-white dark:bg-[#181938] border border-gray-300 dark:border-[#2f3166] text-gray-800 dark:text-slate-100 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full",

  // Transaction items
  transactionsList: "space-y-3",
  viewAllButton: "mt-4 w-full text-center py-3 text-orange-600 dark:text-amber-300 font-medium hover:bg-amber-50 dark:hover:bg-[#1a1c42] rounded-xl transition-colors flex items-center justify-center gap-2",
  emptyState: "text-center py-8",
  emptyStateIcon: "w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 dark:bg-amber-950/40 flex items-center justify-center",
  emptyStateText: "text-gray-600 dark:text-slate-200 font-medium",
  emptyStateSubtext: "text-sm text-gray-500 dark:text-slate-300 mt-2",

  // Warm Icons
  iconOrange: "p-2 bg-orange-100 dark:bg-amber-950/60 rounded-lg",
  iconAmber: "p-2 bg-amber-100 dark:bg-yellow-950/60 rounded-lg",
  iconYellow: "p-2 bg-yellow-100 dark:bg-orange-950/60 rounded-lg",
  textOrange: "text-orange-600 dark:text-amber-400",
  textAmber: "text-amber-600 dark:text-yellow-400",
  textYellow: "text-yellow-600 dark:text-orange-400",

  // Warm Borders
  borderOrange: "border-l-4 border-orange-500",
  borderAmber: "border-l-4 border-amber-500",
  borderYellow: "border-l-4 border-yellow-500",

  // Chart tooltip styles
  tooltipContent: {
    backgroundColor: "rgba(20, 21, 48, 0.95)",
    border: "1px solid #252752",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
    padding: "12px",
    backdropFilter: "blur(4px)",
  },

  // Chart height style
  chartHeight: "h-64 sm:h-80",

  // Export button
  chartExportButton: "flex items-center gap-1 bg-white dark:bg-[#181938] border border-gray-300 dark:border-[#2f3166] hover:bg-gray-50 dark:hover:bg-[#20224d] text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg transition-all text-sm hover:shadow-md",

  // Timeframe positioning
  timeframePositioning: "flex justify-end mt-4",

  // Transaction item specific styles
  transactionItemContainer: "flex items-center justify-between p-3 sm:p-4 hover:bg-amber-50/70 dark:hover:bg-[#1a1c42] rounded-xl transition-all duration-200 border border-gray-100 dark:border-[#252752] cursor-pointer mb-3 group",
  transactionAmount: "font-bold",
  transactionIcon: "lg:p-3 md:p-3 p-1 rounded-lg",
};

export const profileStyles = {
  // Container styles
  container: "max-w-4xl mx-auto py-8 px-4",
  mainContainer: "bg-white dark:bg-[#141530] rounded-2xl shadow-sm border border-gray-100 dark:border-[#252752] overflow-hidden",

  // Header styles (blues and purples)
  header: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center",
  avatar: "w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4",
  userName: "text-2xl font-bold text-white",
  userEmail: "text-indigo-100 mt-2",

  // Content styles
  content: "p-6 sm:p-8",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8",

  // Card styles
  card: "bg-gray-50 dark:bg-[#181938] rounded-xl p-6 border border-transparent dark:border-[#252752]",
  cardTitle: "text-xl font-semibold pb-3 text-gray-800 dark:text-slate-100 flex items-center",
  icon: "w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400",

  // Form styles (light text in dark mode)
  label: "text-sm text-gray-500 dark:text-slate-300 block mb-1",
  input: "w-full px-4 py-2 bg-white dark:bg-[#12132b] border border-gray-300 dark:border-[#2f3166] text-gray-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500",
  inputWithError: "w-full px-4 py-2 bg-gray-50 dark:bg-[#12132b] border border-gray-300 dark:border-[#2f3166] rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 dark:text-slate-100",

  // Button styles (blues and purples)
  buttonPrimary: "flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-medium shadow-md",
  buttonSecondary: "flex-1 py-2.5 border border-gray-300 dark:border-[#2f3166] text-gray-700 dark:text-slate-200 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-[#20224d]",
  editButton: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm",
  changeButton: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium lg:text-sm",

  // Security item
  securityItem: "flex items-center justify-between p-4 bg-white dark:bg-[#12132b] rounded-xl border border-gray-200 dark:border-[#252752]",
  securityText: "font-medium lg:text-sm text-gray-400 dark:text-slate-300",

  // Modal styles
  modalContent: "bg-white dark:bg-[#141530] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-transparent dark:border-[#252752]",
  modalHeader: "flex justify-between items-center mb-6",
  modalTitle: "text-xl font-bold text-gray-800 dark:text-white",

  // Password input
  passwordLabel: "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
  passwordContainer: "relative",
  passwordToggle: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-300 hover:text-gray-600 dark:hover:text-slate-100",

  // Error text
  errorText: "mt-1 text-sm text-rose-600 dark:text-rose-400"
};

export const modalStyles = {
  // Modal container
  overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50",
  modalContainer: "bg-white dark:bg-[#141530] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-transparent dark:border-[#252752]",

  // Header
  modalHeader: "flex justify-between items-center mb-4",
  modalTitle: "text-xl font-bold text-gray-800 dark:text-white",
  closeButton: "text-gray-500 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white",

  // Form elements
  form: "space-y-4",
  label: "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
  input: (ringColor) => `w-full border border-gray-200 dark:border-[#2f3166] bg-white dark:bg-[#181938] text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${ringColor}`,

  // Type buttons (warm income / warm expense)
  typeButtonContainer: "flex gap-4",
  typeButton: (isSelected, color) =>
    `flex-1 py-2 rounded-lg font-medium ${
      isSelected
        ? `${color} text-white shadow-md`
        : 'bg-gray-100 dark:bg-[#181938] text-gray-800 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#252752]'
    }`,

  // Submit button
  submitButton: (color) => `w-full text-white py-3 rounded-lg font-medium mt-4 shadow-md hover:shadow-lg transition-all ${color}`,

  // Color classes
  colorClasses: {
    teal: {
      button: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700",
      ring: "focus:ring-emerald-500",
      typeButtonSelected: "bg-emerald-600 dark:bg-emerald-600",
    },
    orange: {
      button: "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700",
      ring: "focus:ring-orange-500",
      typeButtonSelected: "bg-orange-500 dark:bg-orange-600",
    },
  },
};

export const loginStyles = {
  // Page container (blues and purples)
  pageContainer: "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0b0d1b] dark:via-[#101127] dark:to-[#13102d]",

  // Card container
  cardContainer: "w-full max-w-md bg-white dark:bg-[#141530] rounded-2xl shadow-xl overflow-hidden border border-transparent dark:border-[#252752]",

  // Header styles (blues and purples)
  header: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-center",
  avatar: "w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4",
  headerTitle: "text-2xl font-bold text-white",
  headerSubtitle: "text-indigo-100 mt-2",

  // Form container
  formContainer: "p-8",

  // Error message
  errorContainer: "mb-6 p-3 bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-300 rounded-lg flex items-center border border-transparent dark:border-rose-900/40",
  errorIcon: "w-6 h-6 rounded-full bg-red-100 dark:bg-rose-900/50 flex items-center justify-center mr-3",
  errorText: "break-words",

  // Form elements (light text)
  label: "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2",
  inputContainer: "relative",
  inputIcon: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-300",
  input: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#181938] border border-gray-200 dark:border-[#2f3166] text-gray-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500",
  passwordInput: "w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#181938] border border-gray-200 dark:border-[#2f3166] text-gray-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500",
  passwordToggle: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-300 hover:text-gray-600 dark:hover:text-slate-100",

  // Checkbox
  checkboxContainer: "mb-6 flex items-center",
  checkbox: "w-4 h-4 text-indigo-600 border-gray-300 dark:border-[#2f3166] rounded focus:ring-indigo-500 bg-white dark:bg-[#181938]",
  checkboxLabel: "ml-2 block text-sm text-gray-700 dark:text-slate-300",

  // Button (blues and purples)
  button: "w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center",
  buttonDisabled: "opacity-80 cursor-not-allowed",

  // Sign up link
  signUpContainer: "mt-8 text-center",
  signUpText: "text-gray-600 dark:text-slate-300",
  signUpLink: "font-medium text-indigo-600 dark:text-indigo-400 hover:underline",

  // Spinner for loading state
  spinner: "animate-spin -ml-1 mr-3 h-5 w-5 text-white"
};

// Styles for Navbar component (blues and purples)
export const navbarStyles = {
  // Layout and container styles
  header: "sticky top-0 z-50 bg-white dark:bg-[#101124]/95 backdrop-blur-md border-b border-gray-100 dark:border-[#222448] shadow-sm",
  container: "flex items-center justify-between px-4 py-3 md:px-8 max-w-7xl mx-auto",

  // Logo styles
  logoContainer: "flex items-center gap-0 cursor-pointer",
  logoImage: "w-15 h-15 rounded-xl overflow-hidden",

  // Text styles
  logoText: "lg:text-3xl md:text-3xl text-2xl text-gray-900 dark:text-indigo-100 font-[550] lobster-regular",

  // User profile styles
  userContainer: "relative",
  userButton: "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#181938] transition-colors",
  userAvatar: "w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg shadow-sm",
  statusIndicator: "absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#101124]",
  userTextContainer: "text-left hidden md:block",
  userName: "text-sm font-medium text-gray-800 dark:text-slate-100 truncate max-w-[120px]",
  userEmail: "text-xs text-gray-500 dark:text-slate-300 truncate max-w-[120px]",
  chevronIcon: (isOpen) => `w-4 h-4 text-gray-500 dark:text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`,

  // Dropdown menu styles
  dropdownMenu: "absolute top-14 right-0 w-56 bg-white dark:bg-[#141530] rounded-xl shadow-xl border border-gray-100 dark:border-[#252752] z-50",
  dropdownHeader: "px-4 py-3 border-b border-gray-100 dark:border-[#252752]",
  dropdownAvatar: "w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg",
  dropdownName: "text-sm text-gray-800 dark:text-slate-100",
  dropdownEmail: "text-xs text-gray-500 dark:text-slate-300",

  // Menu items
  menuItemContainer: "p-1.5",
  menuItem: "w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#181938] text-sm text-gray-700 dark:text-slate-200 flex items-center gap-3 rounded-lg",
  menuItemBorder: "p-1.5 border-t border-gray-100 dark:border-[#252752]",
  logoutButton: "flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg"
};

export const signupStyles = {
  // Page container (blues and purples)
  pageContainer: "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0b0d1b] dark:via-[#101127] dark:to-[#13102d]",

  // Card container
  cardContainer: "w-full max-w-md bg-white dark:bg-[#141530] rounded-2xl shadow-xl overflow-hidden border border-transparent dark:border-[#252752]",

  // Header styles (blues and purples)
  header: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-center relative",
  avatar: "w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4",
  headerTitle: "text-2xl font-bold text-white",
  headerSubtitle: "text-indigo-100 mt-2",
  backButton: "absolute top-4 left-4 p-2 text-white rounded-full hover:bg-white/10 transition-colors",

  // Form container
  formContainer: "p-8",

  // Error messages
  apiError: "mb-4 text-center text-sm text-rose-600 dark:text-rose-400",
  fieldError: "mt-1 text-sm text-rose-600 dark:text-rose-400",

  // Form elements
  label: "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2",
  inputContainer: "relative",
  inputIcon: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-300",
  input: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#181938] border border-gray-200 dark:border-[#2f3166] text-gray-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500",
  passwordInput: "w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#181938] border border-gray-200 dark:border-[#2f3166] text-gray-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500",
  passwordToggle: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-300 hover:text-gray-600 dark:hover:text-slate-100",

  // Checkbox
  checkboxContainer: "mb-6 flex items-center",
  checkbox: "w-4 h-4 text-indigo-600 border-gray-300 dark:border-[#2f3166] rounded focus:ring-indigo-500 bg-white dark:bg-[#181938]",
  checkboxLabel: "ml-2 block text-sm text-gray-700 dark:text-slate-300",

  // Button
  button: "w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center",
  buttonDisabled: "opacity-80 cursor-not-allowed",

  // Sign in link
  signInContainer: "mt-8 text-center",
  signInText: "text-gray-600 dark:text-slate-300",
  signInLink: "font-medium text-indigo-600 dark:text-indigo-400 hover:underline",

  // Spinner for loading state
  spinner: "animate-spin -ml-1 mr-3 h-5 w-5 text-white"
};

export const transactionItemStyles = {
  // Container styles
  container: (isEditing, classes) =>
    `flex flex-col md:flex-row items-stretch justify-between gap-3 p-4 rounded-xl border border-gray-100 dark:border-[#252752] mb-3 last:mb-0 ${isEditing ? classes.bg : "hover:bg-gray-50 dark:hover:bg-[#181938]/60"}`,

  // Layout styles
  mainContainer: "flex items-center gap-3 flex-1 min-w-0",
  actionsContainer: "flex items-center justify-between gap-3 mt-2 md:mt-0",
  amountContainer: "min-w-[100px] flex-shrink-0 flex justify-end",
  buttonsContainer: "flex gap-1 flex-shrink-0",

  // Icon styles
  iconContainer: (iconClass, classes) => `${iconClass} ${classes.iconBg}`,

  // Content styles (crisp light text)
  contentContainer: "min-w-0 flex-1",
  description: "font-medium text-gray-800 dark:text-slate-100 truncate",
  details: "text-xs text-gray-500 dark:text-slate-300 mt-1 truncate",

  // Input styles
  input: (hasError, classes) =>
    `w-full bg-white dark:bg-[#181938] text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 ${hasError ? "border-red-500 ring-red-500" : `${classes.border} ${classes.ring}`}`,
  amountInput: (hasError, classes) =>
    `w-full max-w-[120px] bg-white dark:bg-[#181938] text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 ${hasError ? "border-red-500 ring-red-500" : `${classes.border} ${classes.ring}`}`,

  // Error styles
  errorText: "text-xs text-rose-600 dark:text-rose-400 mt-1",

  // Amount display
  amountText: (amountClass, classes) => `${amountClass} ${classes.text}`,

  // Button styles
  saveButton: (classes) => `p-2 ${classes.button} rounded-lg`,
  cancelButton: "p-2 bg-gray-300 dark:bg-[#252752] text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-400 dark:hover:bg-[#2f3166]",
  editButton: (classes) => `p-2 ${classes.text} rounded-lg hover:${classes.bg}`,
  deleteButton: (classes) => `p-2 ${classes.text} rounded-lg hover:${classes.bg}`
};

export const sidebarStyles = {
  // Layout and container styles
  sidebarContainer: {
    base: "hidden lg:flex flex-col pt-3 fixed top-16 bottom-0 z-30"
  },

  sidebarInner: {
    base: "bg-white dark:bg-[#101124] border-r border-gray-200 dark:border-[#222448] shadow-md h-full flex flex-col"
  },

  // User profile section
  userProfileContainer: {
    base: "p-4 border-b pt-20 md:pt-5 lg:pt-5 xl:pt-5 border-gray-100 dark:border-[#222448]",
    collapsed: "px-3",
    expanded: "px-6"
  },

  userInitials: {
    base: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md"
  },

  // Menu items (blues and purples)
  menuList: {
    base: "space-y-1 px-2"
  },

  menuItem: {
    base: "relative flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200",
    active: "text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 shadow-sm font-semibold",
    inactive: "text-gray-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-[#181938]",
    collapsed: "justify-center px-0 mx-2",
    expanded: "px-4"
  },

  menuIcon: {
    active: "text-indigo-600 dark:text-indigo-400",
    inactive: "text-gray-500 dark:text-slate-300"
  },

  activeIndicator: "absolute right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping",

  // Toggle button
  toggleButton: {
    base: "absolute -right-3 top-12 z-20 w-6 h-6 bg-white dark:bg-[#141530] border border-gray-300 dark:border-[#2f3166] rounded-full flex items-center justify-center text-gray-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#1f224d] transition-all"
  },

  // Footer section
  footerContainer: {
    base: "border-t border-gray-100 dark:border-[#222448] p-4",
    collapsed: "px-3",
    expanded: "px-6"
  },

  footerLink: {
    base: "flex items-center gap-3 py-2 rounded-xl font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-[#181938]",
    collapsed: "justify-center"
  },

  logoutButton: {
    base: "flex items-center gap-3 py-2 rounded-xl font-medium text-gray-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 w-full mt-1",
    collapsed: "justify-center"
  },

  // Mobile sidebar
  mobileOverlay: "fixed inset-0 z-40 lg:hidden",
  mobileBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",

  mobileSidebar: {
    base: "absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-[#101124] shadow-2xl rounded-r-2xl overflow-hidden border-r border-transparent dark:border-[#222448]"
  },

  mobileHeader: "p-6 flex justify-between items-center border-b border-gray-100 dark:border-[#222448]",
  mobileUserContainer: "flex pt-28 items-center gap-3",
  mobileCloseButton: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#181938] text-gray-600 dark:text-slate-300",

  mobileMenuList: "space-y-1",
  mobileMenuItem: {
    base: "flex items-center gap-4 px-6 py-4 font-medium",
    active: "text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40",
    inactive: "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#181938]"
  },

  mobileFooter: "border-t border-gray-100 dark:border-[#222448] p-6",
  mobileFooterLink: "flex items-center gap-4 py-2 font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300",
  mobileLogoutButton: "flex items-center gap-4 py-2 font-medium text-gray-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 w-full",

  // Mobile menu button
  mobileMenuButton: "hidden"
};

// Helper function to combine class names
export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const styles = {
  // Layout and Container Styles (midnight navy-purple theme)
  layout: {
    root: "min-h-screen bg-slate-50/60 dark:bg-[#0b0d1b] text-gray-900 dark:text-slate-100 transition-colors duration-200",
    mainContainer: (sidebarCollapsed) =>
      `p-4 sm:p-6 pt-6 pb-24 lg:pb-8 transition-all duration-300 max-w-7xl mx-auto ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`,
  },

  // Header Styles
  header: {
    container: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4",
    title: "text-2xl font-bold text-gray-800 dark:text-white",
    subtitle: "text-gray-600 dark:text-slate-300",
  },

  // Stat Card Styles
  statCards: {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6",
    card: "bg-white dark:bg-[#141530] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#252752]",
    cardHeader: "flex justify-between items-start",
    cardTitle: "text-sm text-gray-600 dark:text-slate-300",
    cardValue: "text-2xl font-bold text-gray-800 dark:text-white mt-1",
    iconContainer: (color) => `bg-${color}-100 dark:bg-${color}-950/60 p-2 rounded-lg`,
    icon: (color) => `w-5 h-5 text-${color}-600 dark:text-${color}-400`,
    cardFooter: "text-xs text-gray-500 dark:text-slate-300 mt-3",
  },

  // Grid Layout
  grid: {
    main: "grid grid-cols-1 lg:grid-cols-3 gap-6",
    leftColumn: "lg:col-span-2 space-y-6",
    rightColumn: "lg:col-span-1 space-y-6",
  },

  // Card Styles
  cards: {
    base: "bg-white dark:bg-[#141530] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#252752]",
    header: "flex justify-between items-center mb-6",
    title: "text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3",
    titleIcon: "w-6 h-6",
  },

  // Recent Transactions Card
  transactions: {
    cardHeader: "flex justify-between items-center mb-4",
    cardTitle: "text-md md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3",
    refreshButton: "p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-[#181938] transition-colors text-indigo-600 dark:text-indigo-400",
    refreshIcon: (loading) => `w-5 h-5 text-gray-500 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`,
    dataStackingInfo: "flex items-center gap-2 text-xs text-gray-500 dark:text-slate-300 mb-4 bg-indigo-50/70 dark:bg-indigo-950/40 p-2 rounded-lg border border-transparent dark:border-indigo-900/30",
    dataStackingIcon: "w-4 h-4 text-indigo-500 dark:text-indigo-400",
    listContainer: "space-y-4 max-h-[500px] overflow-y-auto pr-2",
    transactionItem: "flex items-center lg:flex-col xl:flex-row md:flex-row justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-[#181938]/60 rounded-xl transition-all duration-200 border border-gray-100 dark:border-[#252752]",
    iconWrapper: (type) => type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300' : 'bg-orange-100 dark:bg-amber-950/60 text-orange-600 dark:text-amber-300',
    icon: "w-4 h-4",
    details: "min-w-0",
    description: "font-medium text-gray-800 dark:text-slate-100 truncate max-w-[120px]",
    meta: "text-xs text-gray-500 dark:text-slate-300 mt-1",
    amount: (type) => `font-semibold ${type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-amber-400'}`,
    emptyState: "text-center py-8",
    emptyIconContainer: "w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center",
    emptyIcon: "w-8 h-8 text-purple-500 dark:text-purple-400",
    emptyText: "text-gray-600 dark:text-slate-300 font-medium",
    viewAllContainer: "pt-4 border-t border-gray-100 dark:border-[#252752]",
    viewAllButton: "w-full flex items-center justify-center gap-2 py-3 text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-50 dark:hover:bg-[#1a1c42] rounded-xl transition-colors",
  },

  // Spending by Category Card (shades of blues and purples)
  categories: {
    title: "text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3",
    titleIcon: "w-6 h-6 text-indigo-500 dark:text-indigo-400",
    list: "space-y-4",
    categoryItem: "flex items-center md:text-lg lg:text-sm xl:text-lg justify-between",
    categoryIconContainer: "bg-indigo-50 dark:bg-[#181938] p-2 rounded-lg text-indigo-600 dark:text-indigo-400",
    categoryIcon: "w-4 h-4 text-indigo-600 dark:text-indigo-300",
    categoryName: "font-medium text-gray-700 dark:text-slate-200",
    categoryAmount: "font-semibold text-gray-800 dark:text-slate-100",
    summaryContainer: "mt-6 pt-6 border-t border-gray-100 dark:border-[#252752]",
    summaryGrid: "grid grid-cols-2 gap-4",
    summaryIncomeCard: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/30 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-900/30",
    summaryExpenseCard: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-xl p-4 border border-orange-100/50 dark:border-amber-900/30",
    summaryTitle: "text-sm text-gray-600 dark:text-slate-300",
    summaryValue: "text-sm font-bold text-gray-800 dark:text-white",
  },

  // Color Helpers (warmer income and expense)
  colors: {
    transaction: {
      text: (type) => type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-amber-400',
      bg: (type) => type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300' : 'bg-orange-100 dark:bg-amber-950/60 text-orange-600 dark:text-amber-300',
    },
    expenseChange: (change) => change > 0 ? 'text-orange-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
  },
};

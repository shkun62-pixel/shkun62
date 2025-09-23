// import React, { useEffect, useRef } from "react";
// import Chart from "chart.js/auto";

// const Dashboard = () => {
//   const revenueChartRef = useRef(null);
//   const expenseChartRef = useRef(null);
//   const revenueInstance = useRef(null);
//   const expenseInstance = useRef(null);

//   useEffect(() => {
//     if (revenueChartRef.current) {
//       if (revenueInstance.current) revenueInstance.current.destroy();

//       revenueInstance.current = new Chart(revenueChartRef.current, {
//         type: "line",
//         data: {
//           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//           datasets: [
//             {
//               label: "Revenue",
//               data: [85000, 92000, 78000, 105000, 118000, 124580],
//               borderColor: "#3B82F6",
//               backgroundColor: "rgba(59, 130, 246, 0.1)",
//               tension: 0.4,
//               fill: true,
//             },
//             {
//               label: "Expenses",
//               data: [65000, 71000, 68000, 82000, 85000, 89240],
//               borderColor: "#EF4444",
//               backgroundColor: "rgba(239, 68, 68, 0.1)",
//               tension: 0.4,
//               fill: true,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: { position: "top" },
//           },
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 callback: (value) => "$" + value / 1000 + "k",
//               },
//             },
//           },
//         },
//       });
//     }

//     if (expenseChartRef.current) {
//       if (expenseInstance.current) expenseInstance.current.destroy();

//       expenseInstance.current = new Chart(expenseChartRef.current, {
//         type: "doughnut",
//         data: {
//           labels: [
//             "Salaries",
//             "Office Rent",
//             "Utilities",
//             "Marketing",
//             "Supplies",
//             "Other",
//           ],
//           datasets: [
//             {
//               data: [45000, 15000, 8000, 12000, 5240, 4000],
//               backgroundColor: [
//                 "#3B82F6",
//                 "#10B981",
//                 "#F59E0B",
//                 "#EF4444",
//                 "#8B5CF6",
//                 "#6B7280",
//               ],
//               borderWidth: 0,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: { position: "bottom" },
//           },
//         },
//       });
//     }

//     return () => {
//       if (revenueInstance.current) revenueInstance.current.destroy();
//       if (expenseInstance.current) expenseInstance.current.destroy();
//     };
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen font-inter">
//       {/* Header */}
//       <header style={{marginTop:-40}} className="bg-white shadow-sm border-b">
//         <div className="flex items-center justify-between px-6 py-4">
//           <div style={{marginLeft:"40%"}}>
//             <h2 className="text-2xl font-bold text-gray-800 text-center">SHKUNSOFT INNOVATIONS</h2>
//             <p className="text-gray-600">
//               Welcome back! Here's your financial overview.
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
//               <span className="text-xl">🔔</span>
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 3
//               </span>
//             </button>
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
//                 V
//               </div>
//               <span className="text-gray-700 font-medium">Vedant</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Dashboard Content */}
//       <main className="p-6">
//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[
//             {
//               title: "Total Revenue",
//               value: "$124,580",
//               change: "↗ +12.5% from last month",
//               color: "text-green-600",
//               bg: "bg-green-100",
//               icon: "💵",
//             },
//             {
//               title: "Total Expenses",
//               value: "$89,240",
//               change: "↗ +8.2% from last month",
//               color: "text-red-600",
//               bg: "bg-red-100",
//               icon: "💸",
//             },
//             {
//               title: "Net Profit",
//               value: "$35,340",
//               change: "↗ +18.7% from last month",
//               color: "text-green-600",
//               bg: "bg-blue-100",
//               icon: "📊",
//             },
//             {
//               title: "Outstanding Invoices",
//               value: "$18,920",
//               change: "12 pending invoices",
//               color: "text-orange-600",
//               bg: "bg-orange-100",
//               icon: "📋",
//             },
//           ].map((card, idx) => (
//             <div
//               key={idx}
//               className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">
//                     {card.title}
//                   </p>
//                   <p className="text-3xl font-bold text-gray-800 mt-2">
//                     {card.value}
//                   </p>
//                   <p className={`${card.color} text-sm mt-1`}>
//                     {card.change}
//                   </p>
//                 </div>
//                 <div
//                   className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}
//                 >
//                   <span className="text-2xl">{card.icon}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 h-80">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Revenue vs Expenses
//               </h3>
//               <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
//                 <option>Last 6 months</option>
//                 <option>Last year</option>
//               </select>
//             </div>
//             <canvas ref={revenueChartRef}></canvas>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 h-80">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Expense Breakdown
//               </h3>
//               <button className="text-sm text-blue-600 hover:text-blue-800">
//                 View Details
//               </button>
//             </div>
//             <canvas ref={expenseChartRef}></canvas>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

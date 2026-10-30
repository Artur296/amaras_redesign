"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PortalSessionUser } from "@/lib/portal-auth";
import type { PortalClient, PortalUser } from "@/lib/portal-db";
import { tours, formatPrice } from "@/lib/tours";

type Props = {
  sessionUser: PortalSessionUser;
};

export default function PortalClientComponent({ sessionUser }: Props) {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"clients" | "employees">("clients");

  // View mode: cards (ideal for mobile) vs table (ideal for desktop spreadsheet)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Detect screen size on mount to pick best default view
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewMode(window.innerWidth < 1024 ? "cards" : "table");
    }
  }, []);

  // Clients state
  const [clients, setClients] = useState<PortalClient[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  // Employees state (Admin only)
  const [employees, setEmployees] = useState<Omit<PortalUser, "passwordHash">[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  // Search, filter & sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [sortBy, setSortBy] = useState<"created_desc" | "tour_date" | "name">("created_desc");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<PortalClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Add client form state
  const [newClientName, setNewClientName] = useState("");
  const [newPhone1, setNewPhone1] = useState("");
  const [newPhone2, setNewPhone2] = useState("");
  const [newTourTitle, setNewTourTitle] = useState("");
  const [newTourDate, setNewTourDate] = useState("");
  const [newAdults, setNewAdults] = useState("2");
  const [newChildren, setNewChildren] = useState("0");
  const [newComments, setNewComments] = useState("");

  // Edit client form state (Admin only)
  const [editClientName, setEditClientName] = useState("");
  const [editPhone1, setEditPhone1] = useState("");
  const [editPhone2, setEditPhone2] = useState("");
  const [editTourTitle, setEditTourTitle] = useState("");
  const [editTourDate, setEditTourDate] = useState("");
  const [editAdults, setEditAdults] = useState("1");
  const [editChildren, setEditChildren] = useState("0");
  const [editComments, setEditComments] = useState("");

  // Matched tour and calculated price for "Добавить клиента"
  const newMatchedTour = useMemo(() => {
    if (!newTourTitle) return null;
    const clean = newTourTitle.trim().toLowerCase();
    return (
      tours.find(
        (t) =>
          t.title.ru.toLowerCase() === clean ||
          t.title.en.toLowerCase() === clean ||
          t.title.hy.toLowerCase() === clean ||
          clean.includes(t.title.ru.toLowerCase()) ||
          t.slug === newTourTitle
      ) || null
    );
  }, [newTourTitle]);

  const newLiveTotal = useMemo(() => {
    if (!newMatchedTour || !newMatchedTour.priceFromAmd) return null;
    const adults = Math.max(1, parseInt(newAdults, 10) || 1);
    const children = Math.max(0, parseInt(newChildren, 10) || 0);
    const adultRate = newMatchedTour.priceFromAmd;
    const childRate = Math.round(adultRate * 0.5);
    return adults * adultRate + children * childRate;
  }, [newMatchedTour, newAdults, newChildren]);

  // Matched tour and calculated price for "Редактировать клиента"
  const editMatchedTour = useMemo(() => {
    if (!editTourTitle) return null;
    const clean = editTourTitle.trim().toLowerCase();
    return (
      tours.find(
        (t) =>
          t.title.ru.toLowerCase() === clean ||
          t.title.en.toLowerCase() === clean ||
          t.title.hy.toLowerCase() === clean ||
          clean.includes(t.title.ru.toLowerCase()) ||
          t.slug === editTourTitle
      ) || null
    );
  }, [editTourTitle]);

  const editLiveTotal = useMemo(() => {
    if (!editMatchedTour || !editMatchedTour.priceFromAmd) return null;
    const adults = Math.max(1, parseInt(editAdults, 10) || 1);
    const children = Math.max(0, parseInt(editChildren, 10) || 0);
    const adultRate = editMatchedTour.priceFromAmd;
    const childRate = Math.round(adultRate * 0.5);
    return adults * adultRate + children * childRate;
  }, [editMatchedTour, editAdults, editChildren]);

  // Fetch Clients
  async function fetchClients() {
    setClientsLoading(true);
    try {
      const res = await fetch("/api/portal/clients", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch {}
    setClientsLoading(false);
  }

  // Fetch Employees (Admin only)
  async function fetchEmployees() {
    if (sessionUser.role !== "admin") return;
    setEmployeesLoading(true);
    try {
      const res = await fetch("/api/portal/users", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.users || []);
      }
    } catch {}
    setEmployeesLoading(false);
  }

  useEffect(() => {
    fetchClients();
    if (sessionUser.role === "admin") {
      fetchEmployees();
    }
  }, [sessionUser.role]);

  // Handle Logout
  async function handleLogout() {
    try {
      await fetch("/api/portal/auth/logout", { method: "POST" });
    } catch {}
    router.push("/portal/login");
    router.refresh();
  }

  // Copy phone number to clipboard
  function copyToClipboard(text: string, id: string) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedPhoneId(id);
      setTimeout(() => setCopiedPhoneId(null), 2000);
    }
  }

  // Submit Add Client
  async function handleAddClientSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/portal/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newClientName,
          phone1: newPhone1,
          phone2: newPhone2,
          tourTitle: newTourTitle,
          tourDate: newTourDate,
          guestsAdults: Number(newAdults) || 1,
          guestsChildren: Number(newChildren) || 0,
          comments: newLiveTotal
            ? (newComments ? `${newComments} | Сумма: ${formatPrice(newLiveTotal)}` : `Сумма: ${formatPrice(newLiveTotal)}`)
            : newComments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Не удалось добавить клиента");
      }

      setNewClientName("");
      setNewPhone1("");
      setNewPhone2("");
      setNewTourTitle("");
      setNewTourDate("");
      setNewAdults("2");
      setNewChildren("0");
      setNewComments("");
      setIsAddModalOpen(false);

      setClients((prev) => [data.client, ...prev]);
    } catch (err: any) {
      setFormError(err.message || "Ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Open Edit Modal (Admin only)
  function openEditModal(c: PortalClient) {
    setEditClient(c);
    setEditClientName(c.clientName);
    setEditPhone1(c.phone1);
    setEditPhone2(c.phone2 || "");
    setEditTourTitle(c.tourTitle);
    setEditTourDate(c.tourDate);
    setEditAdults(String(c.guestsAdults));
    setEditChildren(String(c.guestsChildren));
    setEditComments(c.comments || "");
    setFormError("");
  }

  // Submit Edit Client (Admin only)
  async function handleEditClientSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editClient) return;
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/portal/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editClient.id,
          clientName: editClientName,
          phone1: editPhone1,
          phone2: editPhone2,
          tourTitle: editTourTitle,
          tourDate: editTourDate,
          guestsAdults: Number(editAdults) || 1,
          guestsChildren: Number(editChildren) || 0,
          comments: editComments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Не удалось обновить данные клиента");
      }

      setClients((prev) => prev.map((item) => (item.id === editClient.id ? data.client : item)));
      setEditClient(null);
    } catch (err: any) {
      setFormError(err.message || "Ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Delete Client (Admin only)
  async function handleDeleteClient(c: PortalClient) {
    if (!confirm(`Вы действительно хотите удалить клиента «${c.clientName}» (#${c.clientNumber})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/portal/clients?id=${c.id}`, { method: "DELETE" });
      if (res.ok) {
        setClients((prev) => prev.filter((item) => item.id !== c.id));
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка удаления");
      }
    } catch {
      alert("Ошибка сети");
    }
  }

  // Update Employee Status (Admin only)
  async function handleUpdateEmployeeStatus(id: string, status: "approved" | "rejected") {
    try {
      const res = await fetch("/api/portal/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        const data = await res.json();
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? data.user : emp)));
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка обновления");
      }
    } catch {
      alert("Ошибка сети");
    }
  }

  // Delete Employee (Admin only)
  async function handleDeleteEmployee(emp: Omit<PortalUser, "passwordHash">) {
    if (!confirm(`Удалить сотрудника «${emp.fullName}» (${emp.username})?`)) return;

    try {
      const res = await fetch(`/api/portal/users?id=${emp.id}`, { method: "DELETE" });
      if (res.ok) {
        setEmployees((prev) => prev.filter((item) => item.id !== emp.id));
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка удаления");
      }
    } catch {
      alert("Ошибка сети");
    }
  }

  // Filtered & sorted clients list
  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.clientName.toLowerCase().includes(q) ||
          c.phone1.toLowerCase().includes(q) ||
          (c.phone2 && c.phone2.toLowerCase().includes(q)) ||
          c.tourTitle.toLowerCase().includes(q) ||
          c.createdByUserName.toLowerCase().includes(q) ||
          (c.comments && c.comments.toLowerCase().includes(q)) ||
          String(c.clientNumber).includes(q)
      );
    }

    // Employee filter (Admin only)
    if (sessionUser.role === "admin" && employeeFilter !== "all") {
      result = result.filter((c) => c.createdByUserId === employeeFilter);
    }

    // Date filter
    const today = new Date().toISOString().slice(0, 10);
    if (dateFilter !== "all") {
      if (dateFilter === "today") {
        result = result.filter((c) => c.tourDate === today);
      } else if (dateFilter === "week") {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().slice(0, 10);
        result = result.filter((c) => c.tourDate >= today && c.tourDate <= nextWeekStr);
      } else if (dateFilter === "month") {
        const monthPrefix = today.slice(0, 7);
        result = result.filter((c) => c.tourDate && c.tourDate.startsWith(monthPrefix));
      }
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "tour_date") {
        return (a.tourDate || "").localeCompare(b.tourDate || "");
      }
      if (sortBy === "name") {
        return a.clientName.localeCompare(b.clientName, "ru");
      }
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });

    return result;
  }, [clients, searchQuery, employeeFilter, dateFilter, sortBy, sessionUser.role]);

  // Today tours count
  const todayToursCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return clients.filter((c) => c.tourDate === today).length;
  }, [clients]);

  // Pending employees count
  const pendingEmployeesCount = useMemo(() => {
    return employees.filter((e) => e.status === "pending").length;
  }, [employees]);

  // Stats
  const totalGuests = useMemo(() => {
    return filteredClients.reduce(
      (sum, c) => sum + (c.guestsAdults || 0) + (c.guestsChildren || 0),
      0
    );
  }, [filteredClients]);

  // Clean phone to WhatsApp link helper
  function toWhatsAppUrl(rawPhone: string) {
    const cleanDigits = rawPhone.replace(/\D/g, "");
    return cleanDigits.length >= 7 ? `https://wa.me/${cleanDigits}` : null;
  }

  // Clean phone to Telegram link helper
  function toTelegramUrl(raw: string) {
    if (raw.startsWith("@")) return `https://t.me/${raw.slice(1)}`;
    const cleanDigits = raw.replace(/\D/g, "");
    return cleanDigits.length >= 7 ? `https://t.me/+${cleanDigits}` : null;
  }

  // Clean phone for tel: link
  function toTelUrl(rawPhone: string) {
    const cleanDigits = rawPhone.replace(/[^\d+]/g, "");
    return cleanDigits ? `tel:${cleanDigits}` : null;
  }

  // Relative / friendly date badge
  function formatTourDate(dateStr: string) {
    if (!dateStr) return { label: "Дата не указана", isUpcoming: false, isToday: false };
    const today = new Date().toISOString().slice(0, 10);
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    const tomorrow = tm.toISOString().slice(0, 10);

    if (dateStr === today) {
      return { label: "Сегодня", isUpcoming: true, isToday: true };
    }
    if (dateStr === tomorrow) {
      return { label: "Завтра", isUpcoming: true, isToday: false };
    }

    try {
      const [y, m, d] = dateStr.split("-");
      const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
      const monthLabel = months[parseInt(m, 10) - 1] || m;
      return {
        label: `${parseInt(d, 10)} ${monthLabel} ${y}`,
        isUpcoming: dateStr > today,
        isToday: false,
      };
    } catch {
      return { label: dateStr, isUpcoming: false, isToday: false };
    }
  }

  return (
    <div className="min-h-screen bg-[#141313] text-[#FCFCF7] flex flex-col font-sans selection:bg-[#C7FF32] selection:text-[#312F2F] pb-24 lg:pb-12">
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1A1919]/90 backdrop-blur-xl px-3 sm:px-6 lg:px-8 py-3 shadow-xl">
        <div className="mx-auto flex items-center justify-between gap-3 max-w-[1700px]">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/images/logo.png"
                alt="AMARAS TOUR"
                width={140}
                height={32}
                className="h-6 sm:h-8 w-auto object-contain"
                priority
              />
            </Link>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1.5 rounded-full bg-[#C7FF32]/10 border border-[#C7FF32]/30 px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF32] animate-ping" />
              ПОРТАЛ
            </div>
          </div>

          {/* User Profile & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-xs">
              <div
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${
                  sessionUser.role === "admin" ? "bg-[#C7FF32]" : "bg-[#586EFF]"
                }`}
              />
              <span className="font-bold text-white text-[11px] sm:text-xs truncate max-w-[110px] sm:max-w-[180px]">
                {sessionUser.role === "admin" ? "Администратор" : sessionUser.fullName}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        {sessionUser.role === "admin" && (
          <div className="mx-auto max-w-[1700px] mt-2.5 pt-2 border-t border-white/5 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("clients")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "clients"
                  ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>📊 Клиенты</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-mono">
                {clients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("employees")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "employees"
                  ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>👥 Сотрудники</span>
              {pendingEmployeesCount > 0 ? (
                <span className="rounded-full bg-red-500 text-white px-2 py-0.2 text-[10px] font-bold animate-pulse">
                  +{pendingEmployeesCount}
                </span>
              ) : (
                <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {employees.length}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-[1700px] mx-auto w-full">
        {activeTab === "clients" ? (
          <div className="space-y-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-3 sm:p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#C7FF32]/10 border border-[#C7FF32]/20 text-[#C7FF32] text-lg sm:text-xl font-bold shrink-0">
                  📋
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50 font-bold">
                    Всего заявок
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                    {clients.length}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-3 sm:p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-lg sm:text-xl font-bold shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50 font-bold">
                    Сегодня
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                    {todayToursCount}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-3 sm:p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#586EFF]/10 border border-[#586EFF]/20 text-[#8C9EFF] text-lg sm:text-xl font-bold shrink-0">
                  👥
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50 font-bold">
                    Туристов
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                    {totalGuests}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-3 sm:p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg sm:text-xl font-bold shrink-0">
                  🎯
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50 font-bold">
                    В выборке
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#C7FF32] font-mono leading-tight">
                    {filteredClients.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar: Search, Filters, View Mode Toggle & Add Button */}
            <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-3.5 sm:p-4 shadow-lg space-y-3.5">
              {/* Top Row: Search & Add button */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по ФИО, номеру, телефону, туру..."
                    className="w-full rounded-xl border border-white/15 bg-black/30 pl-9 pr-8 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none focus:ring-1 focus:ring-[#C7FF32]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7FF32] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/20 hover:bg-[#b8f226] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="text-base font-black leading-none">+</span>
                    <span>Новый клиент</span>
                  </button>

                  <a
                    href={`/api/portal/export${
                      sessionUser.role === "admin" && employeeFilter !== "all"
                        ? `?employee=${employeeFilter}`
                        : ""
                    }`}
                    download
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    title="Скачать таблицу в Excel (.csv)"
                  >
                    <span>📥</span>
                    <span className="hidden sm:inline">Excel</span>
                  </a>
                </div>
              </div>

              {/* Bottom Row: Filters & View Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5">
                {/* Date Filter Chips (Scrollable on small phones) */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
                  <span className="text-white/40 text-xs px-1 shrink-0 font-medium">Период:</span>
                  {(
                    [
                      { id: "all", label: "Все" },
                      { id: "today", label: "Сегодня" },
                      { id: "week", label: "7 дней" },
                      { id: "month", label: "Месяц" },
                    ] as const
                  ).map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setDateFilter(btn.id)}
                      className={`px-3 py-1 text-xs rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                        dateFilter === btn.id
                          ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                          : "text-white/60 hover:text-white bg-white/5"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Manager filter & Sort & View Mode */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Manager filter (Admin only) */}
                  {sessionUser.role === "admin" && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/20 px-2.5 py-1 text-xs">
                      <span className="text-white/40 font-medium text-[11px]">Менеджер:</span>
                      <select
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="all" className="bg-[#242323] text-white">
                          Все
                        </option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id} className="bg-[#242323] text-white">
                            {emp.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sort selector */}
                  <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/20 px-2.5 py-1 text-xs">
                    <span className="text-white/40 text-[11px]">Сорт:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="created_desc" className="bg-[#242323] text-white">
                        Сначала новые
                      </option>
                      <option value="tour_date" className="bg-[#242323] text-white">
                        По дате тура
                      </option>
                      <option value="name" className="bg-[#242323] text-white">
                        По имени (А-Я)
                      </option>
                    </select>
                  </div>

                  {/* View Mode Switcher: Cards vs Table */}
                  <div className="flex items-center rounded-xl border border-white/15 bg-black/30 p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("cards")}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        viewMode === "cards"
                          ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                      title="Режим карточек (удобно для телефонов)"
                    >
                      <span>📱</span>
                      <span className="hidden sm:inline">Карточки</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        viewMode === "table"
                          ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                      title="Режим таблицы (как в Excel)"
                    >
                      <span>📊</span>
                      <span className="hidden sm:inline">Таблица</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content View: CARDS (Mobile optimized) or TABLE (Excel spreadsheet) */}
            {clientsLoading ? (
              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-12 text-center text-white/50">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#C7FF32] border-t-transparent mb-3" />
                <div className="text-sm">Загрузка данных портала...</div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-base font-bold text-white">Клиенты не найдены</div>
                <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "По вашему запросу совпадений нет. Попробуйте изменить параметры поиска."
                    : "Нажмите «Новый клиент», чтобы добавить первую запись в базу."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#C7FF32] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#312F2F] hover:bg-[#b8f226]"
                >
                  + Добавить первого клиента
                </button>
              </div>
            ) : viewMode === "cards" ? (
              /* ================= MOBILE CARDS VIEW ================= */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredClients.map((c) => {
                  const wa1 = toWhatsAppUrl(c.phone1);
                  const tg2 = c.phone2 ? toTelegramUrl(c.phone2) : null;
                  const tel1 = toTelUrl(c.phone1);
                  const tel2 = c.phone2 ? toTelUrl(c.phone2) : null;
                  const dateInfo = formatTourDate(c.tourDate);

                  return (
                    <div
                      key={c.id}
                      className="group rounded-2xl border border-white/10 bg-[#1E1D1D] hover:border-[#C7FF32]/40 transition-all shadow-md hover:shadow-xl p-4 flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Accent glow on top */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C7FF32]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Card Header: Client Number + Date + Manager */}
                      <div>
                        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-[#C7FF32]/10 border border-[#C7FF32]/30 text-[#C7FF32]">
                              #{c.clientNumber}
                            </span>
                            <span className="text-[11px] text-white/40 font-mono">
                              {c.createdAt ? c.createdAt.slice(0, 10) : ""}
                            </span>
                          </div>

                          <div className="text-[11px] text-white/60 flex items-center gap-1 font-medium bg-white/5 px-2 py-0.5 rounded-full">
                            <span>👤</span>
                            <span className="truncate max-w-[120px]">{c.createdByUserName}</span>
                          </div>
                        </div>

                        {/* Client Name */}
                        <div className="mt-3 flex items-start justify-between gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                            {c.clientName}
                          </h3>

                          {/* Guests count pill */}
                          <div className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs font-mono font-bold text-white">
                            {c.guestsAdults}в
                            {c.guestsChildren > 0 && (
                              <span className="text-[#C7FF32] ml-1">+{c.guestsChildren}д</span>
                            )}
                          </div>
                        </div>

                        {/* Tour / Destination & Date */}
                        <div className="mt-2.5 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C7FF32]">
                            <span className="text-sm">📍</span>
                            <span className="truncate">{c.tourTitle}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-white/70">
                            <span className="text-sm">📅</span>
                            <span
                              className={`font-semibold px-2 py-0.5 rounded-md ${
                                dateInfo.isToday
                                  ? "bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold"
                                  : dateInfo.isUpcoming
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : "bg-white/5 text-white/70"
                              }`}
                            >
                              {dateInfo.label}
                            </span>
                            <span className="text-white/40 font-mono text-[11px]">({c.tourDate})</span>
                          </div>
                        </div>

                        {/* Comments bubble */}
                        {c.comments && (
                          <div className="mt-3 rounded-xl bg-black/30 border border-white/5 p-2.5 text-xs text-white/80 leading-relaxed italic">
                            💬 «{c.comments}»
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Quick Action Buttons (Call, WhatsApp, Telegram, Edit/Delete) */}
                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2.5">
                        {/* Primary Phone 1 Quick Contact */}
                        <div className="flex items-center gap-1.5">
                          {/* Call Button */}
                          {tel1 ? (
                            <a
                              href={tel1}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2 text-xs font-bold text-white transition-all active:scale-95"
                              title={`Позвонить ${c.phone1}`}
                            >
                              <span>📞</span>
                              <span className="font-mono truncate">{c.phone1}</span>
                            </a>
                          ) : (
                            <div className="flex-1 px-3 py-2 text-xs font-mono text-white/70 bg-white/5 rounded-xl">
                              {c.phone1}
                            </div>
                          )}

                          {/* WhatsApp Button */}
                          {wa1 && (
                            <a
                              href={wa1}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-2 text-xs font-bold shadow-md shadow-[#25D366]/20 transition-all active:scale-95"
                              title="Написать в WhatsApp"
                            >
                              <span>💬</span>
                              <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                          )}

                          {/* Copy Phone Button */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.phone1, c.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs cursor-pointer"
                            title="Скопировать номер"
                          >
                            {copiedPhoneId === c.id ? "✓" : "📋"}
                          </button>
                        </div>

                        {/* Secondary Phone 2 (if exists) */}
                        {c.phone2 && (
                          <div className="flex items-center gap-1.5 text-xs">
                            {tel2 ? (
                              <a
                                href={tel2}
                                className="flex-1 inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-white/80 font-mono truncate"
                              >
                                <span>📞2:</span>
                                <span className="truncate">{c.phone2}</span>
                              </a>
                            ) : (
                              <span className="flex-1 text-white/60 font-mono text-xs px-2 truncate">
                                {c.phone2}
                              </span>
                            )}

                            {tg2 && (
                              <a
                                href={tg2}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 hover:bg-[#229ED9]/30 text-[#60c3f5] px-2.5 py-1.5 font-bold"
                                title="Написать в Telegram"
                              >
                                <span>✈️</span>
                                <span>Telegram</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* Admin Action Buttons */}
                        {sessionUser.role === "admin" && (
                          <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => openEditModal(c)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#C7FF32] text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <span>✏️</span>
                              <span>Изменить</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(c)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <span>🗑️</span>
                              <span>Удалить</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ================= SPREADSHEET TABLE VIEW ================= */
              <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[1050px]">
                    <thead>
                      <tr className="border-b border-white/15 bg-black/40 text-white/60 font-mono uppercase text-[11px] tracking-wider select-none">
                        <th className="py-3 px-3 w-14 text-center">№</th>
                        <th className="py-3 px-3.5 w-32">Добавлен</th>
                        <th className="py-3 px-3.5 min-w-[180px]">ФИО Клиента</th>
                        <th className="py-3 px-3.5 min-w-[180px]">Телефон 1 (WhatsApp)</th>
                        <th className="py-3 px-3.5 min-w-[160px]">Телефон 2 (Telegram)</th>
                        <th className="py-3 px-3.5 min-w-[200px]">Тур / Направление</th>
                        <th className="py-3 px-3 w-28 text-center">Дата поездки</th>
                        <th className="py-3 px-3 w-20 text-center">Гости</th>
                        <th className="py-3 px-3.5 min-w-[220px]">Комментарий / Пожелания</th>
                        <th className="py-3 px-3.5 w-36">Менеджер</th>
                        {sessionUser.role === "admin" && (
                          <th className="py-3 px-3 w-24 text-center">Действия</th>
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5 font-sans">
                      {filteredClients.map((c, index) => {
                        const wa1 = toWhatsAppUrl(c.phone1);
                        const tg2 = c.phone2 ? toTelegramUrl(c.phone2) : null;
                        const isEven = index % 2 === 0;

                        return (
                          <tr
                            key={c.id}
                            className={`transition-colors hover:bg-white/[0.06] ${
                              isEven ? "bg-white/[0.01]" : "bg-black/10"
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono text-[#C7FF32] font-bold">
                              #{c.clientNumber}
                            </td>

                            <td className="py-3 px-3.5 text-white/60 font-mono text-[11px] whitespace-nowrap">
                              {c.createdAt ? c.createdAt.slice(0, 10) : ""}
                              <span className="block text-[10px] text-white/40">
                                {c.createdAt ? c.createdAt.slice(11, 16) : ""}
                              </span>
                            </td>

                            <td className="py-3 px-3.5 font-bold text-white">{c.clientName}</td>

                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {wa1 ? (
                                  <a
                                    href={wa1}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-mono font-medium"
                                    title="Написать в WhatsApp"
                                  >
                                    <span>💬</span>
                                    <span>{c.phone1}</span>
                                  </a>
                                ) : (
                                  <span className="font-mono text-white/80">{c.phone1}</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(c.phone1, c.id)}
                                  className="text-white/40 hover:text-white text-[11px] p-0.5 cursor-pointer"
                                  title="Скопировать"
                                >
                                  {copiedPhoneId === c.id ? "✓" : "📋"}
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {c.phone2 ? (
                                tg2 ? (
                                  <a
                                    href={tg2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#229ED9] hover:underline font-mono font-medium"
                                    title="Написать в Telegram"
                                  >
                                    <span>✈️</span>
                                    <span>{c.phone2}</span>
                                  </a>
                                ) : (
                                  <span className="font-mono text-white/70">{c.phone2}</span>
                                )
                              ) : (
                                <span className="text-white/20">—</span>
                              )}
                            </td>

                            <td className="py-3 px-3.5">
                              <span className="font-medium text-[#C7FF32]">{c.tourTitle}</span>
                            </td>

                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                                {c.tourDate}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-xs">
                              <span className="font-bold text-white">{c.guestsAdults}в</span>
                              {c.guestsChildren > 0 && (
                                <span className="text-white/60 ml-1">+{c.guestsChildren}д</span>
                              )}
                            </td>

                            <td className="py-3 px-3.5 text-xs text-white/75 max-w-[280px]">
                              {c.comments ? (
                                <span className="line-clamp-2" title={c.comments}>
                                  {c.comments}
                                </span>
                              ) : (
                                <span className="text-white/20">—</span>
                              )}
                            </td>

                            <td className="py-3 px-3.5 whitespace-nowrap text-xs text-white/70 font-medium">
                              <span className="inline-flex items-center gap-1">
                                <span>👤</span>
                                <span>{c.createdByUserName}</span>
                              </span>
                            </td>

                            {sessionUser.role === "admin" && (
                              <td className="py-3 px-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(c)}
                                    className="p-1 rounded-md text-white/60 hover:text-[#C7FF32] hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Редактировать запись"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteClient(c)}
                                    className="p-1 rounded-md text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Удалить клиента"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-white/10 bg-black/30 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-2">
                  <div>
                    Показано записей: <span className="font-bold text-white">{filteredClients.length}</span>
                  </div>
                  <div className="text-[11px]">
                    Синхронизация в реальном времени • Портал AMARAS TOUR
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= EMPLOYEES MANAGEMENT VIEW (ADMIN ONLY) ================= */
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Управление доступом сотрудников</span>
                  {pendingEmployeesCount > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-2.5 py-0.5 font-bold">
                      {pendingEmployeesCount} новых
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Новые сотрудники регистрируются через форму входа. Одобрите их аккаунт, чтобы открыть доступ к порталу.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchEmployees}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                🔄 Обновить список
              </button>
            </div>

            {/* Mobile Employee Cards (visible on smaller screens) */}
            <div className="grid grid-cols-1 md:hidden gap-3">
              {employeesLoading ? (
                <div className="p-8 text-center text-white/50 text-sm">Загрузка...</div>
              ) : employees.length === 0 ? (
                <div className="p-8 text-center text-white/50 text-sm">Сотрудников пока нет</div>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="rounded-2xl border border-white/10 bg-[#1E1D1D] p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-base">{emp.fullName}</div>
                        <div className="font-mono text-xs text-white/60">@{emp.username}</div>
                        {emp.phone && (
                          <div className="text-xs text-[#C7FF32] font-mono mt-0.5">{emp.phone}</div>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        {emp.status === "pending" && (
                          <span className="rounded-full bg-yellow-500/15 border border-yellow-500/30 px-2.5 py-0.5 text-[10px] font-bold text-yellow-300">
                            ⏳ Ожидает
                          </span>
                        )}
                        {emp.status === "approved" && (
                          <span className="rounded-full bg-green-500/15 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-bold text-green-300">
                            ✓ Активен
                          </span>
                        )}
                        {emp.status === "rejected" && (
                          <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-bold text-red-300">
                            ✕ Блок
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      {emp.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateEmployeeStatus(emp.id, "approved")}
                          className="flex-1 rounded-xl bg-green-600 py-2 text-xs font-bold text-white hover:bg-green-500 transition-all cursor-pointer"
                        >
                          Одобрить
                        </button>
                      )}
                      {emp.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateEmployeeStatus(emp.id, "rejected")}
                          className="flex-1 rounded-xl bg-yellow-600/30 border border-yellow-500/30 py-2 text-xs font-bold text-yellow-300 hover:bg-yellow-600/50 transition-all cursor-pointer"
                        >
                          Заблокировать
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteEmployee(emp)}
                        className="px-3 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-xs font-bold text-red-300 hover:bg-red-600/40 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Employee Table */}
            <div className="hidden md:block rounded-2xl border border-white/10 bg-[#1E1D1D] shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/15 bg-black/40 text-white/60 font-mono uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Сотрудник</th>
                      <th className="py-3 px-4">Логин</th>
                      <th className="py-3 px-4">Телефон / Контакт</th>
                      <th className="py-3 px-4">Дата регистрации</th>
                      <th className="py-3 px-4 text-center">Статус</th>
                      <th className="py-3 px-4 text-center">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {employeesLoading ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-white/50">
                          Загрузка списка сотрудников...
                        </td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-white/50">
                          Зарегистрированных сотрудников пока нет
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => {
                        return (
                          <tr key={emp.id} className="hover:bg-white/[0.04] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">{emp.fullName}</td>
                            <td className="py-3.5 px-4 font-mono text-white/80">{emp.username}</td>
                            <td className="py-3.5 px-4 font-mono text-white/70">{emp.phone || "—"}</td>
                            <td className="py-3.5 px-4 text-white/50 font-mono text-xs">
                              {emp.createdAt ? emp.createdAt.slice(0, 10) : ""}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {emp.status === "pending" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 px-3 py-1 text-xs font-bold text-yellow-300">
                                  ⏳ Ожидает
                                </span>
                              )}
                              {emp.status === "approved" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/30 px-3 py-1 text-xs font-bold text-green-300">
                                  ✓ Доступ разрешен
                                </span>
                              )}
                              {emp.status === "rejected" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-300">
                                  ✕ Заблокирован
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {emp.status !== "approved" && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEmployeeStatus(emp.id, "approved")}
                                    className="rounded-lg bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-500 transition-all cursor-pointer"
                                  >
                                    Одобрить
                                  </button>
                                )}
                                {emp.status !== "rejected" && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEmployeeStatus(emp.id, "rejected")}
                                    className="rounded-lg bg-yellow-600/30 border border-yellow-500/30 px-3 py-1 text-xs font-bold text-yellow-300 hover:bg-yellow-600/50 transition-all cursor-pointer"
                                  >
                                    Заблокировать
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEmployee(emp)}
                                  className="rounded-lg bg-red-600/20 border border-red-500/30 px-2.5 py-1 text-xs font-bold text-red-300 hover:bg-red-600/40 transition-all cursor-pointer"
                                  title="Удалить аккаунт"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile: Quick "+ Добавить" */}
      {activeTab === "clients" && (
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-6 right-5 z-40 sm:hidden flex items-center gap-2 rounded-full bg-[#C7FF32] px-5 py-3.5 text-xs font-black uppercase tracking-wider text-[#312F2F] shadow-2xl shadow-[#C7FF32]/40 active:scale-95 transition-all cursor-pointer border border-black/20"
        >
          <span className="text-lg leading-none font-black">+</span>
          <span>Новый клиент</span>
        </button>
      )}

      {/* ================= MODAL: ADD CLIENT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/15 bg-[#1E1D1D] p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
            {/* Modal header with drag indicator on mobile */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-white/20 mb-3 sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Добавить клиента</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddClientSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  ФИО Клиента *
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Телефон 1 (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone1}
                    onChange={(e) => setNewPhone1(e.target.value)}
                    placeholder="+7 999 123 45 67"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Телефон 2 (Telegram/WA)
                  </label>
                  <input
                    type="text"
                    value={newPhone2}
                    onChange={(e) => setNewPhone2(e.target.value)}
                    placeholder="+374... или @username"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Тур / Направление *
                  </label>
                  <select
                    value={newMatchedTour?.slug || "custom"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        setNewTourTitle("");
                      } else {
                        const found = tours.find((t) => t.slug === val);
                        if (found) {
                          setNewTourTitle(found.title.ru);
                        }
                      }
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#252528] px-3.5 py-3 text-sm text-white focus:border-[#C7FF32] focus:outline-none cursor-pointer"
                  >
                    <option value="custom" className="bg-[#1f1f22] text-white">
                      — Выберите тур из каталога или введите вручную —
                    </option>
                    {tours.map((t) => (
                      <option key={t.slug} value={t.slug} className="bg-[#1f1f22] text-white">
                        {t.title.ru} ({formatPrice(t.priceFromAmd)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={newTourTitle}
                    onChange={(e) => setNewTourTitle(e.target.value)}
                    placeholder="Севан и Дилижан"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Дата поездки *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTourDate}
                    onChange={(e) => setNewTourDate(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Взрослых
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newAdults}
                    onChange={(e) => setNewAdults(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Детей
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newChildren}
                    onChange={(e) => setNewChildren(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Price Calculation in Portal */}
              {newLiveTotal !== null && (
                <div className="rounded-xl border border-[#C7FF32]/40 bg-[#C7FF32]/10 p-3.5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#C7FF32] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
                      <span>Автоматический расчёт стоимости:</span>
                    </span>
                    <span className="text-xs text-white/75 block mt-0.5">
                      {newAdults} взр. × {formatPrice(newMatchedTour!.priceFromAmd)}
                      {Number(newChildren) > 0 ? ` + ${newChildren} дет. × ${formatPrice(Math.round(newMatchedTour!.priceFromAmd * 0.5))}` : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#C7FF32]">
                      {formatPrice(newLiveTotal)}
                    </span>
                    <span className="block text-[10px] text-white/60 uppercase font-semibold">
                      Итого за тур
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  Комментарии и пожелания
                </label>
                <textarea
                  rows={3}
                  value={newComments}
                  onChange={(e) => setNewComments(e.target.value)}
                  placeholder="Особые пожелания, трансфер, отель, предоплата..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#C7FF32] py-3 text-sm font-black uppercase tracking-wider text-[#312F2F] hover:bg-[#b8f226] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#C7FF32]/20"
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CLIENT (ADMIN ONLY) ================= */}
      {editClient && sessionUser.role === "admin" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/15 bg-[#1E1D1D] p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-white/20 mb-3 sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Редактировать #{editClient.clientNumber}
              </h3>
              <button
                type="button"
                onClick={() => setEditClient(null)}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditClientSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  ФИО Клиента
                </label>
                <input
                  type="text"
                  required
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Телефон 1 (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone1}
                    onChange={(e) => setEditPhone1(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Телефон 2 (Telegram/WA)
                  </label>
                  <input
                    type="text"
                    value={editPhone2}
                    onChange={(e) => setEditPhone2(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Тур / Направление
                  </label>
                  <select
                    value={editMatchedTour?.slug || "custom"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        setEditTourTitle("");
                      } else {
                        const found = tours.find((t) => t.slug === val);
                        if (found) {
                          setEditTourTitle(found.title.ru);
                        }
                      }
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#252528] px-3.5 py-3 text-sm text-white focus:border-[#C7FF32] focus:outline-none cursor-pointer"
                  >
                    <option value="custom" className="bg-[#1f1f22] text-white">
                      — Выберите тур из каталога или введите вручную —
                    </option>
                    {tours.map((t) => (
                      <option key={t.slug} value={t.slug} className="bg-[#1f1f22] text-white">
                        {t.title.ru} ({formatPrice(t.priceFromAmd)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={editTourTitle}
                    onChange={(e) => setEditTourTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Дата поездки
                  </label>
                  <input
                    type="date"
                    required
                    value={editTourDate}
                    onChange={(e) => setEditTourDate(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Взрослых
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editAdults}
                    onChange={(e) => setEditAdults(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Детей
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={editChildren}
                    onChange={(e) => setEditChildren(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Price Calculation in Edit Client Modal */}
              {editLiveTotal !== null && (
                <div className="rounded-xl border border-[#C7FF32]/40 bg-[#C7FF32]/10 p-3.5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#C7FF32] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF32] animate-pulse" />
                      <span>Автоматический расчёт стоимости:</span>
                    </span>
                    <span className="text-xs text-white/75 block mt-0.5">
                      {editAdults} взр. × {formatPrice(editMatchedTour!.priceFromAmd)}
                      {Number(editChildren) > 0 ? ` + ${editChildren} дет. × ${formatPrice(Math.round(editMatchedTour!.priceFromAmd * 0.5))}` : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#C7FF32]">
                      {formatPrice(editLiveTotal)}
                    </span>
                    <span className="block text-[10px] text-white/60 uppercase font-semibold">
                      Итого за тур
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  Комментарии и пожелания
                </label>
                <textarea
                  rows={3}
                  value={editComments}
                  onChange={(e) => setEditComments(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="text-[11px] text-white/50 pt-1">
                Создал: {editClient.createdByUserName} • {editClient.createdAt?.slice(0, 10)}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditClient(null)}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#C7FF32] py-3 text-sm font-black uppercase tracking-wider text-[#312F2F] hover:bg-[#b8f226] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#C7FF32]/20"
                >
                  {isSubmitting ? "Сохранение..." : "Обновить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

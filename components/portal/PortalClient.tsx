"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PortalSessionUser } from "@/lib/portal-auth";
import type { PortalClient, PortalUser } from "@/lib/portal-db";

type Props = {
  sessionUser: PortalSessionUser;
};

export default function PortalClientComponent({ sessionUser }: Props) {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"clients" | "employees">("clients");

  // Clients state
  const [clients, setClients] = useState<PortalClient[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  // Employees state (Admin only)
  const [employees, setEmployees] = useState<Omit<PortalUser, "passwordHash">[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<PortalClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

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

  // 1. Fetch Clients
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

  // 2. Fetch Employees (Admin only)
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
          comments: newComments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Не удалось добавить клиента");
      }

      // Reset form and close
      setNewClientName("");
      setNewPhone1("");
      setNewPhone2("");
      setNewTourTitle("");
      setNewTourDate("");
      setNewAdults("2");
      setNewChildren("0");
      setNewComments("");
      setIsAddModalOpen(false);

      // Prepend newly added client to table
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

  // Filtered clients list
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
    if (dateFilter !== "all") {
      const today = new Date().toISOString().slice(0, 10);
      if (dateFilter === "today") {
        result = result.filter((c) => c.tourDate === today);
      } else if (dateFilter === "week") {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().slice(0, 10);
        result = result.filter((c) => c.tourDate >= today && c.tourDate <= nextWeekStr);
      } else if (dateFilter === "month") {
        const monthPrefix = today.slice(0, 7); // YYYY-MM
        result = result.filter((c) => c.tourDate && c.tourDate.startsWith(monthPrefix));
      }
    }

    return result;
  }, [clients, searchQuery, employeeFilter, dateFilter, sessionUser.role]);

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

  return (
    <div className="min-h-screen bg-[#181717] text-[#FCFCF7] flex flex-col font-sans selection:bg-[#C7FF32] selection:text-[#312F2F]">
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#212020]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 max-w-[1700px]">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3.5">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85">
              <Image
                src="/images/logo.png"
                alt="AMARAS TOUR"
                width={160}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <span className="rounded-lg bg-[#C7FF32]/10 border border-[#C7FF32]/30 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
              ПОРТАЛ
            </span>
          </div>

          {/* User Profile & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* User Badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  sessionUser.role === "admin" ? "bg-[#C7FF32] animate-pulse" : "bg-[#586EFF]"
                }`}
              />
              <span className="font-bold text-white">
                {sessionUser.role === "admin" ? "Администратор" : sessionUser.fullName}
              </span>
              {sessionUser.role === "employee" && (
                <span className="text-white/50 text-[10px]">({sessionUser.username})</span>
              )}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        {sessionUser.role === "admin" && (
          <div className="mx-auto max-w-[1700px] mt-3 pt-2.5 border-t border-white/5 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("clients")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "clients"
                  ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>📊 База клиентов</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-mono">
                {clients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("employees")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "employees"
                  ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>👥 Сотрудники</span>
              {pendingEmployeesCount > 0 ? (
                <span className="rounded-full bg-red-500 text-white px-2 py-0.2 text-[10px] font-bold animate-pulse">
                  +{pendingEmployeesCount} новых
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto w-full">
        {activeTab === "clients" ? (
          /* ================= CLIENTS EXCEL SPREADSHEET VIEW ================= */
          <div className="space-y-4">
            {/* Action Bar: Stats, Search, Filters & Export */}
            <div className="rounded-2xl border border-white/10 bg-[#212020] p-4 sm:p-5 shadow-lg space-y-4">
              {/* Row 1: Key Stats & Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Stats Chips */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
                    <span className="text-white/60">Всего заявок: </span>
                    <span className="font-bold text-[#C7FF32] font-mono text-base">
                      {filteredClients.length}
                    </span>
                    {filteredClients.length !== clients.length && (
                      <span className="text-white/40 text-xs"> (из {clients.length})</span>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
                    <span className="text-white/60">Всего туристов: </span>
                    <span className="font-bold text-white font-mono text-base">{totalGuests}</span>
                  </div>

                  {sessionUser.role === "employee" && (
                    <div className="rounded-xl border border-[#586EFF]/30 bg-[#586EFF]/10 px-3 py-2 text-xs text-[#8C9EFF] font-semibold">
                      🔒 Отображаются только ваши клиенты
                    </div>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C7FF32] px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/20 hover:bg-[#b8f226] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="text-base font-black">+</span>
                    <span>Добавить клиента</span>
                  </button>

                  <a
                    href={`/api/portal/export${
                      sessionUser.role === "admin" && employeeFilter !== "all"
                        ? `?employee=${employeeFilter}`
                        : ""
                    }`}
                    download
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
                    title="Скачать таблицу в формате Excel (.csv)"
                  >
                    <span>📥</span>
                    <span>Скачать в Excel</span>
                  </a>
                </div>
              </div>

              {/* Row 2: Search Input & Filters */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-2 border-t border-white/5">
                {/* Search */}
                <div className="relative flex-1 min-w-[260px]">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по ФИО, телефону, туру, комментариям..."
                    className="w-full rounded-xl border border-white/15 bg-black/20 pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/20 p-1 text-xs">
                  <span className="text-white/40 px-2 font-medium">Дата:</span>
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
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        dateFilter === btn.id
                          ? "bg-[#C7FF32] text-[#312F2F]"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Employee Filter (Admin only) */}
                {sessionUser.role === "admin" && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/20 px-3 py-1.5 text-xs">
                    <span className="text-white/40 font-medium">Менеджер:</span>
                    <select
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#242323] text-white">
                        Все менеджеры
                      </option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id} className="bg-[#242323] text-white">
                          {emp.fullName} ({emp.username})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Excel-like Spreadsheet Data Table */}
            <div className="rounded-2xl border border-white/10 bg-[#212020] shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[1000px]">
                  {/* Table Header */}
                  <thead>
                    <tr className="border-b border-white/15 bg-black/40 text-white/60 font-mono uppercase text-[11px] tracking-wider select-none">
                      <th className="py-3 px-3 w-14 text-center">№</th>
                      <th className="py-3 px-3.5 w-32">Добавлен</th>
                      <th className="py-3 px-3.5 min-w-[180px]">ФИО Клиента</th>
                      <th className="py-3 px-3.5 min-w-[160px]">Телефон 1 (WhatsApp)</th>
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

                  {/* Table Body */}
                  <tbody className="divide-y divide-white/5 font-sans">
                    {clientsLoading ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-white/50">
                          Загрузка таблицы клиентов...
                        </td>
                      </tr>
                    ) : filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-14 text-center">
                          <div className="text-3xl mb-2">📋</div>
                          <div className="text-base font-bold text-white/80">Клиенты не найдены</div>
                          <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
                            {searchQuery
                              ? "По вашему поисковому запросу ничего не найдено"
                              : "Нажмите «Добавить клиента», чтобы внести первую запись в таблицу"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((c, index) => {
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
                            {/* № */}
                            <td className="py-3 px-3 text-center font-mono text-white/50 font-bold">
                              #{c.clientNumber}
                            </td>

                            {/* Added Date */}
                            <td className="py-3 px-3.5 text-white/60 font-mono text-[11px] whitespace-nowrap">
                              {c.createdAt ? c.createdAt.slice(0, 10) : ""}
                              <span className="block text-[10px] text-white/40">
                                {c.createdAt ? c.createdAt.slice(11, 16) : ""}
                              </span>
                            </td>

                            {/* Client Name */}
                            <td className="py-3 px-3.5 font-bold text-white">
                              {c.clientName}
                            </td>

                            {/* Phone 1 (WhatsApp) */}
                            <td className="py-3 px-3.5 whitespace-nowrap">
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
                            </td>

                            {/* Phone 2 */}
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {c.phone2 ? (
                                tg2 ? (
                                  <a
                                    href={tg2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#229ED9] hover:underline font-mono font-medium"
                                    title="Написать в Telegram / WhatsApp"
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

                            {/* Tour / Destination */}
                            <td className="py-3 px-3.5">
                              <span className="font-medium text-[#C7FF32]">
                                {c.tourTitle}
                              </span>
                            </td>

                            {/* Tour Date */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                                {c.tourDate}
                              </span>
                            </td>

                            {/* Guests (Adults + Kids) */}
                            <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-xs">
                              <span className="font-bold text-white">{c.guestsAdults}в</span>
                              {c.guestsChildren > 0 && (
                                <span className="text-white/60 ml-1">+{c.guestsChildren}д</span>
                              )}
                            </td>

                            {/* Comments */}
                            <td className="py-3 px-3.5 text-xs text-white/75 max-w-[280px]">
                              {c.comments ? (
                                <span className="line-clamp-2" title={c.comments}>
                                  {c.comments}
                                </span>
                              ) : (
                                <span className="text-white/20">—</span>
                              )}
                            </td>

                            {/* Manager */}
                            <td className="py-3 px-3.5 whitespace-nowrap text-xs text-white/70 font-medium">
                              <span className="inline-flex items-center gap-1">
                                <span>👤</span>
                                <span>{c.createdByUserName}</span>
                              </span>
                            </td>

                            {/* Actions (Admin Only) */}
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
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="border-t border-white/10 bg-black/30 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-2">
                <div>
                  Показано записей: <span className="font-bold text-white">{filteredClients.length}</span>
                </div>
                <div className="text-[11px]">
                  Данные обновляются в реальном времени • Портал AMARAS TOUR
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= EMPLOYEES MANAGEMENT VIEW (ADMIN ONLY) ================= */
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#212020] p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Управление доступом сотрудников</span>
                  {pendingEmployeesCount > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-2.5 py-0.5 font-bold">
                      {pendingEmployeesCount} ожидают одобрения
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Новые работники регистрируются на странице входа. Только после вашего одобрения
                  они получают доступ к внесению клиентов.
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

            {/* Employees Table */}
            <div className="rounded-2xl border border-white/10 bg-[#212020] shadow-xl overflow-hidden">
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
                            {/* Full Name */}
                            <td className="py-3.5 px-4 font-bold text-white">
                              {emp.fullName}
                            </td>

                            {/* Username */}
                            <td className="py-3.5 px-4 font-mono text-white/80">
                              {emp.username}
                            </td>

                            {/* Phone */}
                            <td className="py-3.5 px-4 font-mono text-white/70">
                              {emp.phone || "—"}
                            </td>

                            {/* Registered Date */}
                            <td className="py-3.5 px-4 text-white/50 font-mono text-xs">
                              {emp.createdAt ? emp.createdAt.slice(0, 10) : ""}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center">
                              {emp.status === "pending" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 px-3 py-1 text-xs font-bold text-yellow-300">
                                  ⏳ На модерации
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

                            {/* Actions */}
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

      {/* ================= MODAL: ADD CLIENT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#242323] p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white">Добавить нового клиента</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/50 hover:text-white p-1 text-sm cursor-pointer"
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
                  placeholder="Например: Иван Иванов"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Телефон 1 (WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone1}
                    onChange={(e) => setNewPhone1(e.target.value)}
                    placeholder="+7 999 123 45 67"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Тур / Направление *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTourTitle}
                    onChange={(e) => setNewTourTitle(e.target.value)}
                    placeholder="Например: Севан и Дилижан"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none cursor-pointer"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  Комментарии и пожелания
                </label>
                <textarea
                  rows={3}
                  value={newComments}
                  onChange={(e) => setNewComments(e.target.value)}
                  placeholder="Особые пожелания, трансфер, отель, предоплата..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-full border border-white/20 bg-white/5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-[#C7FF32] py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] hover:bg-[#b8f226] transition-all cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#242323] p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Редактировать запись #{editClient.clientNumber}
              </h3>
              <button
                type="button"
                onClick={() => setEditClient(null)}
                className="text-white/50 hover:text-white p-1 text-sm cursor-pointer"
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
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Телефон 1 (WhatsApp)
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone1}
                    onChange={(e) => setEditPhone1(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Тур / Направление
                  </label>
                  <input
                    type="text"
                    required
                    value={editTourTitle}
                    onChange={(e) => setEditTourTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  Комментарии и пожелания
                </label>
                <textarea
                  rows={3}
                  value={editComments}
                  onChange={(e) => setEditComments(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#C7FF32] focus:outline-none"
                />
              </div>

              <div className="text-[11px] text-white/50 pt-1">
                Создал: {editClient.createdByUserName} • {editClient.createdAt?.slice(0, 10)}
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditClient(null)}
                  className="flex-1 rounded-full border border-white/20 bg-white/5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-[#C7FF32] py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] hover:bg-[#b8f226] transition-all cursor-pointer disabled:opacity-50"
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

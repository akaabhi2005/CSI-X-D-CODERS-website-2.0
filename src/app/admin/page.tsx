"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Trash2, Plus, Calendar as CalendarIcon, Users, Image as ImageIcon, 
  Award, LayoutDashboard, LogOut, Newspaper, BarChart3, Download, Upload, 
  RotateCcw, Edit3, Check, X, Shield, Sparkles, ExternalLink, FileText, CheckCircle2,
  Search, Copy, Eye, SlidersHorizontal, RefreshCw, EyeOff
} from "lucide-react";
import { 
  DataStore, EventItem, TeamMemberItem, LegacyHeadItem, SubTeamItem, 
  CoreValueItem, NewsIssueItem, GalleryItem, ClubStats 
} from "@/lib/dataStore";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type ActiveTab = "dashboard" | "events" | "team" | "about" | "legacy" | "news" | "gallery" | "stats";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>("all");
  const [teamRoleFilter, setTeamRoleFilter] = useState<string>("all");
  const [gallerySizeFilter, setGallerySizeFilter] = useState<string>("all");

  // Dynamic CMS States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [legacyHeads, setLegacyHeads] = useState<LegacyHeadItem[]>([]);
  const [subTeams, setSubTeams] = useState<SubTeamItem[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValueItem[]>([]);
  const [newsIssues, setNewsIssues] = useState<NewsIssueItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<ClubStats>({
    eventsHosted: "50+",
    activeMembers: "1k+",
    liveProjects: "10+",
    placementRate: "100%"
  });

  // Modal / Form States
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aboutSubTab, setAboutSubTab] = useState<"subteams" | "corevalues">("subteams");

  // Item Specific Form States
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({});
  const [teamForm, setTeamForm] = useState<Partial<TeamMemberItem> & { skillsText?: string }>({});
  const [legacyForm, setLegacyForm] = useState<Partial<LegacyHeadItem>>({});
  const [subTeamForm, setSubTeamForm] = useState<Partial<SubTeamItem> & { pointsText?: string }>({});
  const [coreValueForm, setCoreValueForm] = useState<Partial<CoreValueItem> & { pointsText?: string }>({});
  const [newsForm, setNewsForm] = useState<Partial<NewsIssueItem> & { topicsText?: string }>({});
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({});
  const [gallerySelectedFile, setGallerySelectedFile] = useState<File | null>(null);
  const [teamSelectedFile, setTeamSelectedFile] = useState<File | null>(null);
  const [legacySelectedFile, setLegacySelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Load from DataStore
  const reloadData = async () => {
    setEvents(await DataStore.getEvents());
    setTeam(await DataStore.getTeam());
    setLegacyHeads(await DataStore.getLegacyHeads());
    setSubTeams(await DataStore.getSubTeams());
    setCoreValues(await DataStore.getCoreValues());
    setNewsIssues(await DataStore.getNewsIssues());
    setGallery(await DataStore.getGallery());
    setStats(await DataStore.getStats());
  };

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        reloadData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        reloadData();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login failed: " + error.message);
      setPassword("");
    } else {
      setIsAuthenticated(true);
      setPassword("");
      showToast("Signed in to Admin CMS successfully!");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    showToast("Signed out.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    DataStore.saveAdminPassword(newPassword.trim());
    setNewPassword("");
    setShowPasswordChange(false);
    showToast("Master password updated successfully!");
  };

  // --- EXPORT & IMPORT BACKUP --- //
  const handleExportBackup = async () => {
    const backup = await DataStore.exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csi_srmcem_decoders_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Full backup JSON exported successfully!");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (await DataStore.importBackup(parsed)) {
          await reloadData();
          showToast("Data backup restored successfully!");
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = async () => {
    if (confirm("Are you sure you want to reset all data to official defaults? This will erase custom additions.")) {
      await DataStore.resetToDefaults();
      await reloadData();
      showToast("Reset to official defaults complete!");
    }
  };

  // --- EVENTS CRUD --- //
  const openEventModal = (item?: EventItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setEventForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setEventForm({
        title: "",
        date: "",
        time: "",
        location: "SRMCEM Campus",
        category: "upcoming",
        color: "sky",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
        description: "",
        registrationUrl: "https://forms.google.com"
      });
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;
    let updated: EventItem[];
    if (modalMode === "edit" && editingId) {
      updated = events.map(ev => ev.id === editingId ? { ...ev, ...eventForm } as EventItem : ev);
    } else {
      const newItem: EventItem = {
        id: `evt-${Date.now()}`,
        title: eventForm.title || "Untitled Event",
        date: eventForm.date || "TBD",
        time: eventForm.time || "TBD",
        location: eventForm.location || "SRMCEM",
        category: (eventForm.category as any) || "upcoming",
        color: (eventForm.color as any) || "sky",
        image: eventForm.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
        description: eventForm.description || "",
        registrationUrl: eventForm.registrationUrl || ""
      };
      updated = [newItem, ...events];
    }
    setEvents(updated);
    DataStore.saveEvents(updated);
    setModalMode(null);
    showToast("Event saved successfully!");
  };

  const handleEventCategoryChange = (id: string, newCategory: "upcoming" | "current" | "past") => {
    const updated = events.map(ev => ev.id === id ? { ...ev, category: newCategory } : ev);
    setEvents(updated);
    DataStore.saveEvents(updated);
    showToast(`Event status updated to "${newCategory}"`);
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    DataStore.saveEvents(updated);
    showToast("Event deleted.");
  };

  // --- TEAM CRUD --- //
  const openTeamModal = (item?: TeamMemberItem) => {
    setTeamSelectedFile(null);
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setTeamForm({
        ...item,
        skillsText: item.skills.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setTeamForm({
        name: "",
        position: "CORE COMMITTEE MEMBER",
        branch: "",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        bio: "",
        level: 5,
        domain: "technical",
        skillsText: "Development, Problem Solving",
        socials: { linkedin: "https://linkedin.com", github: "https://github.com", email: "" }
      });
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.position) return;
    const skillsArray = (teamForm.skillsText || "")
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    let finalImageUrl = teamForm.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";

    if (teamSelectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", teamSelectedFile);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        
        if (result.success) {
          finalImageUrl = result.url;
        } else {
          alert("Failed to upload image.");
          setIsUploading(false);
          return;
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Error uploading image.");
        setIsUploading(false);
        return;
      }
    }
    
    setIsUploading(false);

    let updated: TeamMemberItem[];
    if (modalMode === "edit" && editingId) {
      const { skillsText, ...cleanTeamForm } = teamForm;
      updated = team.map(m => m.id === editingId ? {
        ...m,
        ...cleanTeamForm,
        image: finalImageUrl,
        skills: skillsArray,
        socials: cleanTeamForm.socials || {}
      } as TeamMemberItem : m);
    } else {
      const newItem: TeamMemberItem = {
        id: `team-${Date.now()}`,
        name: teamForm.name || "",
        position: teamForm.position || "CORE COMMITTEE MEMBER",
        branch: teamForm.branch || "",
        image: finalImageUrl,
        bio: teamForm.bio || "",
        level: teamForm.level || 5,
        domain: teamForm.domain || "technical",
        skills: skillsArray,
        socials: teamForm.socials || {}
      };
      updated = [...team, newItem];
    }
    setTeam(updated);
    DataStore.saveTeam(updated);
    setModalMode(null);
    showToast("Team member saved successfully!");
  };

  const handleDuplicateTeam = (item: TeamMemberItem) => {
    const duplicated: TeamMemberItem = {
      ...item,
      id: `team-${Date.now()}`,
      name: `${item.name} (Copy)`
    };
    const updated = [...team, duplicated];
    setTeam(updated);
    DataStore.saveTeam(updated);
    showToast(`Duplicated ${item.name}`);
  };

  const handleDeleteTeam = (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    DataStore.saveTeam(updated);
    showToast("Team member removed.");
  };

  // --- LEGACY (HALL OF FAME) CRUD --- //
  const openLegacyModal = (item?: LegacyHeadItem) => {
    setLegacySelectedFile(null);
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setLegacyForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setLegacyForm({
        name: "",
        role: "President (2022-2023)",
        tenure: "2022-2023",
        placedAt: "Google",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "",
        highlight: "SDE @ Google • National Hackathons"
      });
    }
  };

  const handleSaveLegacy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legacyForm.name || !legacyForm.bio) return;

    setIsUploading(true);
    let finalImageUrl = legacyForm.image || "";

    if (legacySelectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", legacySelectedFile);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        
        const result = await res.json();
        
        if (result.success) {
          finalImageUrl = result.url;
        } else {
          alert("Failed to upload image.");
          setIsUploading(false);
          return;
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Error uploading image.");
        setIsUploading(false);
        return;
      }
    }

    let updated: LegacyHeadItem[];
    if (modalMode === "edit" && editingId) {
      updated = legacyHeads.map(l => l.id === editingId ? { ...l, ...legacyForm, image: finalImageUrl } as LegacyHeadItem : l);
    } else {
      const newItem: LegacyHeadItem = {
        id: `legacy-${Date.now()}`,
        name: legacyForm.name || "",
        role: legacyForm.role || "Former Head",
        tenure: legacyForm.tenure || "Leadership & Guidance",
        placedAt: legacyForm.placedAt || "Top Placement",
        image: finalImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        bio: legacyForm.bio || "",
        highlight: legacyForm.highlight || "Mentorship & Leadership"
      };
      updated = [...legacyHeads, newItem];
    }
    setLegacyHeads(updated);
    DataStore.saveLegacyHeads(updated);
    setModalMode(null);
    setIsUploading(false);
    showToast("Hall of Fame leader saved successfully!");
  };

  const handleDeleteLegacy = (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni leader?")) return;
    const updated = legacyHeads.filter(l => l.id !== id);
    setLegacyHeads(updated);
    DataStore.saveLegacyHeads(updated);
    showToast("Alumni leader removed.");
  };

  // --- ABOUT SUB-TEAMS CRUD --- //
  const openSubTeamModal = (item?: SubTeamItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setSubTeamForm({
        ...item,
        pointsText: item.points.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setSubTeamForm({
        title: "",
        category: "Domain Wing",
        color: "sky",
        frontDesc: "",
        backDesc: "",
        pointsText: "Feature 1, Feature 2, Feature 3"
      });
    }
  };

  const handleSaveSubTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTeamForm.title || !subTeamForm.frontDesc) return;
    const pts = (subTeamForm.pointsText || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let updated: SubTeamItem[];
    if (modalMode === "edit" && editingId) {
      const { pointsText, ...cleanSubTeamForm } = subTeamForm;
      updated = subTeams.map(st => st.id === editingId ? {
        ...st,
        ...cleanSubTeamForm,
        points: pts
      } as SubTeamItem : st);
    } else {
      const newItem: SubTeamItem = {
        id: `sub-${Date.now()}`,
        title: subTeamForm.title || "",
        category: subTeamForm.category || "Domain Wing",
        color: (subTeamForm.color as any) || "sky",
        frontDesc: subTeamForm.frontDesc || "",
        backDesc: subTeamForm.backDesc || "",
        points: pts
      };
      updated = [...subTeams, newItem];
    }
    setSubTeams(updated);
    DataStore.saveSubTeams(updated);
    setModalMode(null);
    showToast("Sub-Team domain saved!");
  };

  const handleDeleteSubTeam = (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-team?")) return;
    const updated = subTeams.filter(s => s.id !== id);
    setSubTeams(updated);
    DataStore.saveSubTeams(updated);
    showToast("Sub-Team removed.");
  };

  // --- ABOUT CORE VALUES CRUD --- //
  const openCoreValueModal = (item?: CoreValueItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setCoreValueForm({
        ...item,
        pointsText: item.points.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setCoreValueForm({
        title: "",
        category: "Pillar",
        color: "sky",
        frontDesc: "",
        backDesc: "",
        pointsText: "Deliverable 1, Deliverable 2, Deliverable 3"
      });
    }
  };

  const handleSaveCoreValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreValueForm.title || !coreValueForm.frontDesc) return;
    const pts = (coreValueForm.pointsText || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let updated: CoreValueItem[];
    if (modalMode === "edit" && editingId) {
      const { pointsText, ...cleanCoreValueForm } = coreValueForm;
      updated = coreValues.map(cv => cv.id === editingId ? {
        ...cv,
        ...cleanCoreValueForm,
        points: pts
      } as CoreValueItem : cv);
    } else {
      const newItem: CoreValueItem = {
        id: `cv-${Date.now()}`,
        title: coreValueForm.title || "",
        category: coreValueForm.category || "Pillar",
        color: (coreValueForm.color as any) || "sky",
        frontDesc: coreValueForm.frontDesc || "",
        backDesc: coreValueForm.backDesc || "",
        points: pts
      };
      updated = [...coreValues, newItem];
    }
    setCoreValues(updated);
    DataStore.saveCoreValues(updated);
    setModalMode(null);
    showToast("Core Value pillar saved!");
  };

  const handleDeleteCoreValue = (id: string) => {
    if (!confirm("Are you sure you want to delete this core value?")) return;
    const updated = coreValues.filter(c => c.id !== id);
    setCoreValues(updated);
    DataStore.saveCoreValues(updated);
    showToast("Core Value removed.");
  };

  // --- NEWS GAZETTE CRUD --- //
  const openNewsModal = (item?: NewsIssueItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setNewsForm({
        ...item,
        topicsText: item.topics.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setNewsForm({
        volume: "Vol. 08",
        month: "October",
        year: "2024",
        title: "Monthly Technical Gazette",
        description: "Official monthly technical gazette featuring project releases and spotlights.",
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=1000",
        pdfUrl: "/documents/csi-gazette-october-2024.pdf",
        fileSize: "5.2 MB",
        pageCount: 16,
        topicsText: "Hackathons, Next.js, Cloud, Placements",
        isCurrent: false
      });
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.pdfUrl) return;
    const topicsArray = (newsForm.topicsText || "")
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    let updated: NewsIssueItem[];
    if (modalMode === "edit" && editingId) {
      const { topicsText, ...cleanNewsForm } = newsForm;
      updated = newsIssues.map(n => n.id === editingId ? {
        ...n,
        ...cleanNewsForm,
        pageCount: Number(cleanNewsForm.pageCount) || 16,
        topics: topicsArray,
        isCurrent: Boolean(cleanNewsForm.isCurrent)
      } as NewsIssueItem : (cleanNewsForm.isCurrent ? { ...n, isCurrent: false } : n));
    } else {
      const newItem: NewsIssueItem = {
        id: `news-${Date.now()}`,
        volume: newsForm.volume || "Vol. 01",
        month: newsForm.month || "Current",
        year: newsForm.year || "2024",
        title: newsForm.title || "Monthly Gazette",
        description: newsForm.description || "",
        coverImage: newsForm.coverImage || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=1000",
        pdfUrl: newsForm.pdfUrl || "",
        fileSize: newsForm.fileSize || "4.5 MB",
        pageCount: Number(newsForm.pageCount) || 12,
        topics: topicsArray,
        isCurrent: Boolean(newsForm.isCurrent)
      };

      if (newItem.isCurrent) {
        updated = [newItem, ...newsIssues.map(n => ({ ...n, isCurrent: false }))];
      } else {
        updated = [newItem, ...newsIssues];
      }
    }
    setNewsIssues(updated);
    DataStore.saveNewsIssues(updated);
    setModalMode(null);
    showToast("News Gazette edition saved!");
  };

  const handleSetCurrentNews = (id: string) => {
    const updated = newsIssues.map(n => ({
      ...n,
      isCurrent: n.id === id
    }));
    setNewsIssues(updated);
    DataStore.saveNewsIssues(updated);
    showToast("Current live edition updated!");
  };

  const handleDeleteNews = (id: string) => {
    if (!confirm("Are you sure you want to delete this edition?")) return;
    const updated = newsIssues.filter(n => n.id !== id);
    setNewsIssues(updated);
    DataStore.saveNewsIssues(updated);
    showToast("News edition removed.");
  };

  // --- GALLERY CRUD --- //
  const openGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setGalleryForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setGalleryForm({
        title: "",
        detail: "",
        image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800&h=800",
        size: "small"
      });
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) return;
    if (!galleryForm.image && !gallerySelectedFile) return;

    setIsUploading(true);
    let finalImageUrl = galleryForm.image || "";

    if (gallerySelectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", gallerySelectedFile);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        
        const result = await res.json();
        
        if (result.success) {
          finalImageUrl = result.url;
        } else {
          alert("Failed to upload image.");
          setIsUploading(false);
          return;
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Error uploading image.");
        setIsUploading(false);
        return;
      }
    }

    let updated: GalleryItem[];
    if (modalMode === "edit" && editingId) {
      updated = gallery.map(g => g.id === editingId ? { ...g, ...galleryForm, image: finalImageUrl } as GalleryItem : g);
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: galleryForm.title || "",
        detail: galleryForm.detail || "",
        image: finalImageUrl,
        size: (galleryForm.size as any) || "small"
      };
      updated = [newItem, ...gallery];
    }
    setGallery(updated);
    DataStore.saveGallery(updated);
    
    // Reset states
    setGallerySelectedFile(null);
    setIsUploading(false);
    setModalMode(null);
    showToast("Gallery moment saved!");
  };

  const handleDeleteGallery = (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    DataStore.saveGallery(updated);
    showToast("Gallery photo removed.");
  };

  // --- STATS UPDATE --- //
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveStats(stats);
    showToast("Homepage metrics saved successfully!");
  };

  // --- SEARCH & FILTER LOGIC --- //
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = eventCategoryFilter === "all" || e.category === eventCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredTeam = team.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const isExecutive = m.position.toUpperCase().includes("CEO") || 
      m.position.toUpperCase().includes("COO") || 
      m.position.toUpperCase().includes("FOUNDER") ||
      m.position.toUpperCase().includes("PRESIDENT");
    const matchesRole = teamRoleFilter === "all" || 
      (teamRoleFilter === "executive" && isExecutive) ||
      (teamRoleFilter === "core" && !isExecutive);
    return matchesSearch && matchesRole;
  });

  const filteredLegacy = legacyHeads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.placedAt && l.placedAt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSubTeams = subTeams.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.frontDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoreValues = coreValues.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.frontDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = newsIssues.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.volume.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.year.includes(searchQuery)
  );

  const filteredGallery = gallery.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = gallerySizeFilter === "all" || g.size === gallerySizeFilter;
    return matchesSearch && matchesSize;
  });

  // --- LOGIN VIEW --- //
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 blur-[80px] md:blur-[160px] opacity-60 md:opacity-100 rounded-full -z-10" />
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1 tracking-tight">Admin CMS Portal</h2>
          <p className="text-slate-400 text-xs sm:text-sm text-center mb-8">
            CSI_SRMCEM X D&apos;CODERS Content Management System
          </p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Admin Email</label>
              <input 
                type="email" 
                placeholder="admin@csisrmcem.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm font-mono tracking-wider mb-4"
              />
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm font-mono tracking-wider"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
            >
              Sign In to CMS
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Helper Sidebar Tab button
  const SidebarTab = ({ id, label, icon: Icon, count }: { id: ActiveTab; label: string; icon: any; count?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setModalMode(null); setSearchQuery(""); }}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm text-left group",
        activeTab === id 
          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-bold" 
          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-sky-400")} />
        <span>{label}</span>
      </div>
      {typeof count === "number" && (
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full font-mono font-bold",
          activeTab === id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
        )}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Floating Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-8 z-[200] bg-sky-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold animate-in fade-in slide-in-from-top-4 border border-sky-400/50">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================================================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 bg-slate-900/60 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl h-fit">
          <div className="mb-4 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block mb-1">
              Admin CMS Portal
            </span>
            <h2 className="text-xl font-extrabold text-white">
              CSI_SRMCEM X D&apos;CODERS
            </h2>
          </div>
          
          <div className="space-y-1">
            <SidebarTab id="dashboard" label="Overview" icon={LayoutDashboard} />
            <SidebarTab id="events" label="Events & Workshops" icon={CalendarIcon} count={events.length} />
            <SidebarTab id="team" label="Team Members" icon={Users} count={team.length} />
            <SidebarTab id="about" label="About & Ecosystem" icon={Sparkles} count={subTeams.length + coreValues.length} />
            <SidebarTab id="legacy" label="Hall of Fame & Alumni" icon={Award} count={legacyHeads.length} />
            <SidebarTab id="news" label="News & PDF Gazette" icon={Newspaper} count={newsIssues.length} />
            <SidebarTab id="gallery" label="Gallery Moments" icon={ImageIcon} count={gallery.length} />
            <SidebarTab id="stats" label="Homepage Stats" icon={BarChart3} />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-sky-300 hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button 
              onClick={handleSignOut} 
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Change Password Dialog */}
          {showPasswordChange && (
            <form onSubmit={handleChangePassword} className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <input
                type="password"
                placeholder="New Master Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                required
              />
              <button type="submit" className="w-full py-1.5 bg-sky-500 text-white rounded-lg text-xs font-bold hover:bg-sky-400">
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl min-h-[650px] relative">
          
          {/* 1. OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">System Status: Live &amp; Synced</span>
                <h1 className="text-3xl font-extrabold text-white mt-1">Dashboard Overview</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage all live content for CSI_SRMCEM X D&apos;CODERS. Changes save immediately to the live site.
                </p>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab("events")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-sky-400 mb-1">{events.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Total Events</div>
                </div>
                <div onClick={() => setActiveTab("team")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-blue-400 mb-1">{team.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Team Members</div>
                </div>
                <div onClick={() => { setActiveTab("about"); setAboutSubTab("subteams"); }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-purple-400 mb-1">{subTeams.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Sub-Teams</div>
                </div>
                <div onClick={() => { setActiveTab("about"); setAboutSubTab("corevalues"); }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-cyan-400 mb-1">{coreValues.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Core Values</div>
                </div>
                <div onClick={() => setActiveTab("legacy")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-indigo-400 mb-1">{legacyHeads.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Hall of Fame</div>
                </div>
                <div onClick={() => setActiveTab("news")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-sky-400 mb-1">{newsIssues.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">News Editions</div>
                </div>
                <div onClick={() => setActiveTab("gallery")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-pink-400 mb-1">{gallery.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Gallery Photos</div>
                </div>
                <div onClick={() => setActiveTab("stats")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{stats.placementRate}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Placement Rate</div>
                </div>
              </div>

              {/* Backup & System Tools */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <span>Data Backup, Export &amp; Reset</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Export complete website data to a JSON file to create a backup, or restore data from a previous file.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import JSON Backup</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>

                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all sm:ml-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENTS MANAGER */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Events &amp; Workshops Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Add, edit, or delete flagship hackathons, bootcamps, and workshops.</p>
                </div>
                <button
                  onClick={() => openEventModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search events by title, location, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  {["all", "upcoming", "current", "past"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEventCategoryFilter(cat)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all",
                        eventCategoryFilter === cat ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {cat === "all" ? "All Events" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No events found matching your criteria.</div>
                ) : (
                  filteredEvents.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-4">
                        <img src={ev.image} alt={ev.title} className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {/* 1-Click Status Dropdown */}
                            <select
                              value={ev.category}
                              onChange={(e) => handleEventCategoryChange(ev.id, e.target.value as any)}
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border bg-transparent cursor-pointer focus:outline-none",
                                ev.category === "upcoming" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" :
                                ev.category === "current" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                                "bg-slate-800 text-slate-400 border-slate-700"
                              )}
                            >
                              <option value="upcoming" className="bg-slate-900 text-sky-300">Upcoming</option>
                              <option value="current" className="bg-slate-900 text-emerald-300">Current / Live</option>
                              <option value="past" className="bg-slate-900 text-slate-400">Past</option>
                            </select>
                            <span className="text-xs text-slate-400 font-mono">{ev.date} • {ev.time}</span>
                            <span className="text-xs text-slate-500">• {ev.location}</span>
                          </div>
                          <h4 className="text-base font-bold text-white">{ev.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{ev.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button onClick={() => openEventModal(ev)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. TEAM MEMBERS MANAGER */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Team Members Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage Executive Board and Core Committee members.</p>
                </div>
                <button
                  onClick={() => openTeamModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {/* Search & Role Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search members by name, role, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  {[
                    { id: "all", label: "All Members" },
                    { id: "executive", label: "Executive Board" },
                    { id: "core", label: "Core Committee" }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setTeamRoleFilter(filter.id)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                        teamRoleFilter === filter.id ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeam.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-slate-500 text-sm">No team members found matching your search.</div>
                ) : (
                  filteredTeam.map((member) => (
                    <div key={member.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={member.image} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                        <div>
                          <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">{member.position}</span>
                          <h4 className="text-base font-bold text-white">{member.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{member.bio || "Active contributor"}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.skills.slice(0, 3).map((s, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleDuplicateTeam(member)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-lg transition-colors" title="Duplicate">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openTeamModal(member)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTeam(member.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. ABOUT & ECOSYSTEM MANAGER */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">About &amp; Ecosystem Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage the 5 Sub-Teams domain wings and 4 Foundational Core Values.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
                    <button
                      onClick={() => { setAboutSubTab("subteams"); setSearchQuery(""); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        aboutSubTab === "subteams" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Sub-Teams ({subTeams.length})
                    </button>
                    <button
                      onClick={() => { setAboutSubTab("corevalues"); setSearchQuery(""); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        aboutSubTab === "corevalues" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Core Values ({coreValues.length})
                    </button>
                  </div>
                  <button
                    onClick={() => aboutSubTab === "subteams" ? openSubTeamModal() : openCoreValueModal()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {aboutSubTab === "subteams" ? "Sub-Team" : "Core Value"}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Teams View */}
              {aboutSubTab === "subteams" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSubTeams.map((st) => (
                    <div key={st.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30">
                            {st.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500">Theme: {st.color}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{st.title}</h4>
                        <p className="text-xs text-slate-300 mt-1">{st.frontDesc}</p>
                        <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 font-bold block mb-0.5">Flip Back Description:</span>
                          {st.backDesc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {st.points.map((pt, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                        <button onClick={() => openSubTeamModal(st)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSubTeam(st.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Core Values View */}
              {aboutSubTab === "corevalues" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCoreValues.map((cv) => (
                    <div key={cv.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            {cv.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500">Theme: {cv.color}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{cv.title}</h4>
                        <p className="text-xs text-slate-300 mt-1">{cv.frontDesc}</p>
                        <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 font-bold block mb-0.5">Flip Back Principle:</span>
                          {cv.backDesc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {cv.points.map((pt, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                        <button onClick={() => openCoreValueModal(cv)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCoreValue(cv.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. HALL OF FAME & ALUMNI LEADERS */}
          {activeTab === "legacy" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Hall of Fame &amp; Alumni Leaders</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage alumni leaders, their companies (Google, Microsoft, etc.), and career paths.</p>
                </div>
                <button
                  onClick={() => openLegacyModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Alumni Leader</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search alumni by name, tenure, placement company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLegacy.map((leader) => (
                  <div key={leader.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={leader.image} alt={leader.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            Placed @ {leader.placedAt || "Alumni"}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{leader.tenure}</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{leader.name}</h4>
                        <span className="text-xs text-sky-400 block">{leader.role}</span>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{leader.bio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => openLegacyModal(leader)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLegacy(leader.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. NEWS GAZETTE ISSUES */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">News Gazette &amp; PDF Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Upload and manage monthly PDF publications and feature editions.</p>
                </div>
                <button
                  onClick={() => openNewsModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gazette Edition</span>
                </button>
              </div>

              <div className="space-y-3">
                {filteredNews.map((issue) => (
                  <div key={issue.id} className={cn(
                    "p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all",
                    issue.isCurrent ? "bg-sky-950/20 border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.15)]" : "bg-slate-900/80 border-slate-800"
                  )}>
                    <div className="flex items-center gap-4">
                      <img src={issue.coverImage} alt={issue.title} className="w-16 h-20 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700 font-bold">
                            {issue.volume} • {issue.month} {issue.year}
                          </span>
                          {issue.isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                              Active Live Edition
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">{issue.fileSize} • {issue.pageCount} Pages</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{issue.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{issue.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {issue.topics.map((tp, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              #{tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {!issue.isCurrent && (
                        <button
                          onClick={() => handleSetCurrentNews(issue.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700"
                        >
                          Set as Live
                        </button>
                      )}
                      <button onClick={() => openNewsModal(issue)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteNews(issue.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. GALLERY MOMENTS */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Gallery Moments Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage photo memories, hackathon photos, and event captures.</p>
                </div>
                <button
                  onClick={() => openGalleryModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search photos by title, caption..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  {["all", "small", "large", "wide", "tall"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setGallerySizeFilter(sz)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all",
                        gallerySizeFilter === sz ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredGallery.map((photo) => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-md">
                    <img src={photo.image} alt={photo.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {photo.size}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white truncate">{photo.title}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{photo.detail || "Moment capture"}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1 rounded-lg backdrop-blur-sm">
                      <button onClick={() => openGalleryModal(photo)} className="p-1 text-slate-300 hover:text-sky-400">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteGallery(photo.id)} className="p-1 text-slate-300 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. HOMEPAGE STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Homepage Metrics &amp; Achievements</h2>
                <p className="text-xs text-slate-400 mt-0.5">Edit high-level statistics shown in the homepage metrics grid.</p>
              </div>

              <form onSubmit={handleSaveStats} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Events Hosted</label>
                    <input
                      type="text"
                      value={stats.eventsHosted}
                      onChange={(e) => setStats({ ...stats, eventsHosted: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Active Members</label>
                    <input
                      type="text"
                      value={stats.activeMembers}
                      onChange={(e) => setStats({ ...stats, activeMembers: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Live Projects</label>
                    <input
                      type="text"
                      value={stats.liveProjects}
                      onChange={(e) => setStats({ ...stats, liveProjects: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Placement Record</label>
                    <input
                      type="text"
                      value={stats.placementRate}
                      onChange={(e) => setStats({ ...stats, placementRate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                >
                  Save Metrics Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIVERSAL RESPONSIVE MODAL POPUP FOR ADD / EDIT */}
      {/* ========================================================================= */}
      {modalMode && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md overflow-y-auto overflow-x-hidden pt-20 sm:pt-24 pb-12 px-4 flex flex-col justify-start sm:justify-center items-center min-h-screen">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-auto max-h-[85vh] overflow-y-auto shadow-2xl relative">
            
            {/* Sticky Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80 sticky top-0 bg-slate-900 z-20 -mx-6 sm:-mx-8 px-6 sm:px-8 -mt-2 pt-2">
              <h3 className="text-lg sm:text-xl font-bold text-white pr-2 truncate">
                {modalMode === "add" ? "Add New" : "Edit"} {
                  activeTab === "events" ? "Event" :
                  activeTab === "team" ? "Team Member" :
                  activeTab === "about" ? (aboutSubTab === "subteams" ? "Sub-Team Domain Wing" : "Core Value Pillar") :
                  activeTab === "legacy" ? "Hall of Fame Leader" :
                  activeTab === "news" ? "News Gazette Edition" : "Gallery Photo"
                }
              </h3>
              <button 
                type="button"
                onClick={() => setModalMode(null)} 
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0 border border-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* EVENT FORM */}
            {activeTab === "events" && (
              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Event Title</label>
                  <input type="text" required placeholder="e.g. Hackathon Decoded 2024" value={eventForm.title || ""} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Date</label>
                    <input type="text" placeholder="e.g. October 15, 2024" required value={eventForm.date || ""} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Time / Duration</label>
                    <input type="text" placeholder="e.g. 10:00 AM (48 Hrs)" value={eventForm.time || ""} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category</label>
                    <select value={eventForm.category || "upcoming"} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="upcoming">Upcoming</option>
                      <option value="current">Current / Live</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Location</label>
                    <input type="text" placeholder="e.g. Main Auditorium / Lab 3" value={eventForm.location || ""} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Banner Image URL</label>
                  <input type="text" placeholder="e.g. /images/... or https://..." value={eventForm.image || ""} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  {eventForm.image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 h-24 bg-black">
                      <img src={eventForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Registration Link (Optional)</label>
                  <input type="text" placeholder="https://forms.google.com/... or /events/..." value={eventForm.registrationUrl || ""} onChange={(e) => setEventForm({ ...eventForm, registrationUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Description</label>
                  <textarea rows={3} placeholder="Event overview, agenda, and guidelines" value={eventForm.description || ""} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Event</button>
              </form>
            )}

            {/* TEAM FORM */}
            {activeTab === "team" && (
              <form onSubmit={handleSaveTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Name</label>
                  <input type="text" required placeholder="e.g. John Doe" value={teamForm.name || ""} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Position / Role</label>
                  <input type="text" placeholder="e.g. FOUNDER & CEO or CORE COMMITTEE MEMBER" required value={teamForm.position || ""} onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Branch</label>
                  <input type="text" placeholder="e.g. CSE, IT, DS, AL" value={teamForm.branch || ""} onChange={(e) => setTeamForm({ ...teamForm, branch: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Hierarchy Level</label>
                    <select value={teamForm.level || 5} onChange={(e) => setTeamForm({ ...teamForm, level: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value={1}>Level 1 (President)</option>
                      <option value={2}>Level 2 (VP)</option>
                      <option value={3}>Level 3 (Head)</option>
                      <option value={4}>Level 4 (Co-head)</option>
                      <option value={5}>Level 5 (Member)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Domain Wing</label>
                    <select value={teamForm.domain || "technical"} onChange={(e) => setTeamForm({ ...teamForm, domain: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="technical">Technical</option>
                      <option value="content">Content</option>
                      <option value="design">Design</option>
                      <option value="photo">Photography</option>
                      <option value="pr">PR & Marketing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Upload Profile Photo (JPG, PNG)</label>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp, image/jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setTeamSelectedFile(e.target.files[0]);
                      }
                    }} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30" 
                  />
                  {teamForm.image && !teamSelectedFile && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <img src={teamForm.image} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-700" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                      <span className="text-xs text-slate-400 font-mono truncate">Current Thumbnail</span>
                    </div>
                  )}
                  {teamSelectedFile && (
                    <div className="mt-2 text-xs text-sky-400 font-mono">
                      Selected: {teamSelectedFile.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Skills (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Full-Stack, Cloud, DSA" value={teamForm.skillsText || ""} onChange={(e) => setTeamForm({ ...teamForm, skillsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Bio / Role Description</label>
                  <textarea rows={2} placeholder="Brief summary of member's responsibilities" value={teamForm.bio || ""} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">LinkedIn URL</label>
                    <input type="text" placeholder="https://linkedin.com/in/..." value={teamForm.socials?.linkedin || ""} onChange={(e) => setTeamForm({ ...teamForm, socials: { ...teamForm.socials, linkedin: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">GitHub URL</label>
                    <input type="text" placeholder="https://github.com/..." value={teamForm.socials?.github || ""} onChange={(e) => setTeamForm({ ...teamForm, socials: { ...teamForm.socials, github: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email</label>
                    <input type="email" placeholder="e.g. name@example.com" value={teamForm.socials?.email || ""} onChange={(e) => setTeamForm({ ...teamForm, socials: { ...teamForm.socials, email: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={isUploading} className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md">
                  {isUploading ? "Uploading Image & Saving..." : "Save Member"}
                </button>
              </form>
            )}

            {/* ABOUT SUB-TEAM FORM */}
            {activeTab === "about" && aboutSubTab === "subteams" && (
              <form onSubmit={handleSaveSubTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Sub-Team Title</label>
                  <input type="text" required placeholder="e.g. Technical Team" value={subTeamForm.title || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Domain Category</label>
                    <input type="text" placeholder="e.g. Core Engineering" value={subTeamForm.category || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Accent Theme</label>
                    <select value={subTeamForm.color || "sky"} onChange={(e) => setSubTeamForm({ ...subTeamForm, color: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="sky">Sky Blue</option>
                      <option value="purple">Purple</option>
                      <option value="blue">Royal Blue</option>
                      <option value="cyan">Electric Cyan</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Front Short Description</label>
                  <input type="text" required placeholder="Short summary displayed on front of card" value={subTeamForm.frontDesc || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, frontDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Back Full Description</label>
                  <textarea rows={3} placeholder="Detailed role description on flip back" value={subTeamForm.backDesc || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, backDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Key Focus Points (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Next.js & Cloud, AI Pipelines, Open Source" value={subTeamForm.pointsText || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, pointsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Sub-Team</button>
              </form>
            )}

            {/* ABOUT CORE VALUE FORM */}
            {activeTab === "about" && aboutSubTab === "corevalues" && (
              <form onSubmit={handleSaveCoreValue} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Title</label>
                  <input type="text" required placeholder="e.g. Hackathons & Tech Talks" value={coreValueForm.title || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Category</label>
                    <input type="text" placeholder="e.g. Innovation & Build" value={coreValueForm.category || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Accent Theme</label>
                    <select value={coreValueForm.color || "sky"} onChange={(e) => setCoreValueForm({ ...coreValueForm, color: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="sky">Sky Blue</option>
                      <option value="blue">Royal Blue</option>
                      <option value="cyan">Electric Cyan</option>
                      <option value="indigo">Indigo</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Front Short Description</label>
                  <input type="text" required placeholder="Short summary displayed on front of card" value={coreValueForm.frontDesc || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, frontDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Back Full Description</label>
                  <textarea rows={3} placeholder="Detailed principle description on flip back" value={coreValueForm.backDesc || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, backDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Deliverables (Comma-separated)</label>
                  <input type="text" placeholder="e.g. 24-48h Sprints, Industry Speakers, Tech Workshops" value={coreValueForm.pointsText || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, pointsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Core Value</button>
              </form>
            )}

            {/* LEGACY LEADER FORM */}
            {activeTab === "legacy" && (
              <form onSubmit={handleSaveLegacy} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Leader Name</label>
                  <input type="text" placeholder="e.g. Rahul Sharma" required value={legacyForm.name || ""} onChange={(e) => setLegacyForm({ ...legacyForm, name: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Role Title</label>
                    <input type="text" placeholder="e.g. President (2022-2023)" value={legacyForm.role || ""} onChange={(e) => setLegacyForm({ ...legacyForm, role: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Placed At Company</label>
                    <input type="text" placeholder="e.g. Google, Microsoft, Amazon" value={legacyForm.placedAt || ""} onChange={(e) => setLegacyForm({ ...legacyForm, placedAt: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Tenure Period</label>
                    <input type="text" placeholder="e.g. 2022-2023" value={legacyForm.tenure || ""} onChange={(e) => setLegacyForm({ ...legacyForm, tenure: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Highlight Tag</label>
                    <input type="text" placeholder="e.g. SDE @ Google • 10+ Hackathons" value={legacyForm.highlight || ""} onChange={(e) => setLegacyForm({ ...legacyForm, highlight: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Upload Photo (JPG, PNG, WebP)</label>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp, image/jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setLegacySelectedFile(e.target.files[0]);
                      }
                    }} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30" 
                  />
                  {(legacySelectedFile || legacyForm.image) && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <img 
                        src={legacySelectedFile ? URL.createObjectURL(legacySelectedFile) : (legacyForm.image || "")} 
                        alt="Preview" 
                        className="w-10 h-10 rounded-full object-cover border border-slate-700" 
                        onError={(e) => { (e.target as any).style.display = 'none'; }} 
                      />
                      <span className="text-xs text-slate-400 font-mono truncate">Photo Preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Contribution Story / Bio</label>
                  <textarea rows={3} required value={legacyForm.bio || ""} onChange={(e) => setLegacyForm({ ...legacyForm, bio: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Hall of Fame Leader</button>
              </form>
            )}

            {/* NEWS & GAZETTE FORM */}
            {activeTab === "news" && (
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Gazette Title</label>
                  <input type="text" required value={newsForm.title || ""} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Volume</label>
                    <input type="text" placeholder="e.g. Vol. 08" value={newsForm.volume || ""} onChange={(e) => setNewsForm({ ...newsForm, volume: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Month</label>
                    <input type="text" placeholder="e.g. October" value={newsForm.month || ""} onChange={(e) => setNewsForm({ ...newsForm, month: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Year</label>
                    <input type="text" placeholder="e.g. 2024" value={newsForm.year || ""} onChange={(e) => setNewsForm({ ...newsForm, year: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Direct PDF URL / Document Path</label>
                  <input type="text" required placeholder="e.g. /documents/gazette.pdf or https://example.com/gazette.pdf" value={newsForm.pdfUrl || ""} onChange={(e) => setNewsForm({ ...newsForm, pdfUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Cover Thumbnail URL</label>
                  <input type="text" placeholder="e.g. /images/... or https://..." value={newsForm.coverImage || ""} onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  {newsForm.coverImage && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <img src={newsForm.coverImage} alt="Preview" className="w-12 h-16 rounded object-cover border border-slate-700" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                      <span className="text-xs text-slate-400 font-mono truncate">Cover Thumbnail Preview</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">File Size</label>
                    <input type="text" placeholder="e.g. 5.4 MB" value={newsForm.fileSize || ""} onChange={(e) => setNewsForm({ ...newsForm, fileSize: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Page Count</label>
                    <input type="number" placeholder="16" value={newsForm.pageCount || 16} onChange={(e) => setNewsForm({ ...newsForm, pageCount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Topics (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Hackathon, AI, Web3, DSA" value={newsForm.topicsText || ""} onChange={(e) => setNewsForm({ ...newsForm, topicsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Summary / Highlights</label>
                  <textarea rows={2} value={newsForm.description || ""} onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="isCurrent" checked={Boolean(newsForm.isCurrent)} onChange={(e) => setNewsForm({ ...newsForm, isCurrent: e.target.checked })} className="rounded text-sky-500 focus:ring-sky-500 cursor-pointer" />
                  <label htmlFor="isCurrent" className="text-xs text-white font-medium cursor-pointer">Set as Current Active Live Edition (Embedded in browser reader)</label>
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Gazette Edition</button>
              </form>
            )}

            {/* GALLERY FORM */}
            {activeTab === "gallery" && (
              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Photo Title</label>
                  <input type="text" required value={galleryForm.title || ""} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Upload Image (JPG, PNG, WebP)</label>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp, image/jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setGallerySelectedFile(e.target.files[0]);
                      }
                    }} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30" 
                  />
                  {(gallerySelectedFile || galleryForm.image) && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 h-28 bg-black">
                      <img 
                        src={gallerySelectedFile ? URL.createObjectURL(gallerySelectedFile) : (galleryForm.image || "")} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as any).style.display = 'none'; }} 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Grid Layout Span</label>
                  <select value={galleryForm.size || "small"} onChange={(e) => setGalleryForm({ ...galleryForm, size: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                    <option value="small">Standard (1x1)</option>
                    <option value="large">Large Highlight (2x2)</option>
                    <option value="wide">Wide Banner (2x1)</option>
                    <option value="tall">Tall Portrait (1x2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Caption Details</label>
                  <textarea rows={2} value={galleryForm.detail || ""} onChange={(e) => setGalleryForm({ ...galleryForm, detail: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" disabled={isUploading} className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md">
                  {isUploading ? "Uploading Image & Saving..." : "Save Photo"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}


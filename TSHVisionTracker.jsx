import React, { useState } from "react";
import {
  Rocket, Target, CheckCircle2, Circle, Clock, TrendingUp,
  MessageSquare, Users, BarChart3, Filter, Search, Edit2,
  Save, Plus, Trash2, Menu, X
} from "lucide-react";

const initialData = {
  northStar: "Improve EBITDA",
  goals: [
    { id: "g1", name: "Revenue Growth", description: "Any effort that has direct tangible impact to revenue", color: "#a7192e" },
    { id: "g2", name: "Process Excellence", description: "Reducing efforts, errors, improving delivery time", color: "#8b1525" },
    { id: "g3", name: "Increase Awareness", description: "Any push effort, marketing / otherwise to increase brand equity", color: "#c92136" },
  ],
  projects: [
    { id: "p1", name: "Instagram Growth", description: "Reach 10K followers by Aug 2026", goalId: "g3", owner: "Sayan Dasgupta", status: "In Progress", progress: 35 },
    { id: "p2", name: "Linkedin Growth", description: "Reach 2K followers by April 2026", goalId: "g3", owner: "Sayan Dasgupta", status: "In Progress", progress: 45 },
    { id: "p3", name: "Website Development", description: "Complete website development", goalId: "g2", owner: "Shrey Mathur", status: "In Progress", progress: 60 },
    { id: "p4", name: "5 Year Birthday Campaign", description: "Carry out 5 year birthday campaign", goalId: "g3", owner: "Karn", status: "Planning", progress: 15 },
    { id: "p5", name: "Ongoing Sales Effort", description: "Generate and close leads", goalId: "g1", owner: "Akanksha", status: "In Progress", progress: 50 },
  ],
  tasks: [
    { id: "t1", name: "Social Media Influencers", description: "Tie up with influencers in colleges", projectId: "p1", assignedTo: "Sayan Dasgupta", dueDate: "2026-02-15", status: "In Progress", priority: "High", comments: "", documentLinks: [] },
    { id: "t2", name: "Linkedin Outreach", description: "Post about corporate clients", projectId: "p2", assignedTo: "Sayan Dasgupta", dueDate: "2026-01-25", status: "In Progress", priority: "Medium", comments: "", documentLinks: [] },
    { id: "t3", name: "Finalise Website Structure", description: "Create wireframes and layouts", projectId: "p3", assignedTo: "Shrey Mathur", dueDate: "2026-01-30", status: "In Progress", priority: "High", comments: "", documentLinks: [] },
  ],
  users: [
    { id: "u1", name: "Admin User", email: "admin@tsh.com", role: "administrator" },
    { id: "u2", name: "Sayan Dasgupta", email: "sayan@tsh.com", role: "employee" },
    { id: "u3", name: "Shrey Mathur", email: "shrey@tsh.com", role: "employee" },
    { id: "u4", name: "Akanksha", email: "akanksha@tsh.com", role: "employee" },
    { id: "u5", name: "Srishti", email: "srishti@tsh.com", role: "employee" },
    { id: "u6", name: "Karn", email: "karn@tsh.com", role: "employee" },
  ],
};

export default function TSHVisionTracker() {
  const autoLoginUser = initialData.users.find((u) => u.role === "administrator");
  const [currentUser, setCurrentUser] = useState(autoLoginUser);
  const [data, setData] = useState(initialData);
  const [activeView, setActiveView] = useState("vision");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [showDocLinksModal, setShowDocLinksModal] = useState(null);
  const [newDocLink, setNewDocLink] = useState({ name: "", url: "" });
  const [showEditNorthStar, setShowEditNorthStar] = useState(false);
  const [editedNorthStar, setEditedNorthStar] = useState(data.northStar);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ name: "", description: "", color: "#8b1525" });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({ name: "", description: "", goalId: "", owner: "", status: "Planning", progress: 0 });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", description: "", projectId: "", assignedTo: "", dueDate: "", priority: "Medium", status: "Not Started" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const calculateGoalProgress = (goalId) => {
    const goalProjects = data.projects.filter((p) => p.goalId === goalId);
    if (goalProjects.length === 0) return 0;
    return Math.round(goalProjects.reduce((sum, p) => sum + p.progress, 0) / goalProjects.length);
  };

  const getFilteredTasks = () => {
    let filtered = currentUser.role === "administrator" ? data.tasks : data.tasks.filter((t) => t.assignedTo === currentUser.name);
    if (searchTerm) filtered = filtered.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "all") filtered = filtered.filter((t) => t.status === filterStatus);
    if (filterPriority !== "all") filtered = filtered.filter((t) => t.priority === filterPriority);
    return filtered;
  };

  const updateTask = (taskId, updates) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)) }));
  };

  const addDocumentLink = (taskId) => {
    if (newDocLink.name && newDocLink.url) {
      const task = data.tasks.find((t) => t.id === taskId);
      const updatedLinks = [...(task.documentLinks || []), { id: Date.now(), ...newDocLink, addedDate: new Date().toISOString() }];
      updateTask(taskId, { documentLinks: updatedLinks });
      setNewDocLink({ name: "", url: "" });
    }
  };

  const removeDocumentLink = (taskId, linkId) => {
    const task = data.tasks.find((t) => t.id === taskId);
    const updatedLinks = task.documentLinks.filter((link) => link.id !== linkId);
    updateTask(taskId, { documentLinks: updatedLinks });
  };

  const addNewTask = () => {
    if (newTask.name && newTask.description && newTask.projectId) {
      const taskId = "t" + (data.tasks.length + 1);
      const task = { id: taskId, ...newTask, comments: "", documentLinks: [] };
      setData((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
      setShowAddTaskModal(false);
      setNewTask({ name: "", description: "", projectId: "", assignedTo: "", dueDate: "", priority: "Medium", status: "Not Started" });
    }
  };

  const updateNorthStar = () => {
    setData((prev) => ({ ...prev, northStar: editedNorthStar }));
    setShowEditNorthStar(false);
  };

  const addNewGoal = () => {
    if (newGoal.name && newGoal.description) {
      const goalId = "g" + (data.goals.length + 1);
      setData((prev) => ({ ...prev, goals: [...prev.goals, { id: goalId, ...newGoal }] }));
      setShowAddGoalModal(false);
      setNewGoal({ name: "", description: "", color: "#8b1525" });
    }
  };

  const updateGoal = () => {
    if (editingGoal) {
      setData((prev) => ({ ...prev, goals: prev.goals.map((g) => (g.id === editingGoal.id ? editingGoal : g)) }));
      setShowEditGoalModal(false);
      setEditingGoal(null);
    }
  };

  const deleteGoal = (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal? All associated projects will also be removed.")) {
      setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== goalId), projects: prev.projects.filter((p) => p.goalId !== goalId) }));
    }
  };

  const addNewProject = () => {
    if (newProject.name && newProject.description && newProject.goalId) {
      const projectId = "p" + (data.projects.length + 1);
      setData((prev) => ({ ...prev, projects: [...prev.projects, { id: projectId, ...newProject }] }));
      setShowAddProjectModal(false);
      setNewProject({ name: "", description: "", goalId: "", owner: "", status: "Planning", progress: 0 });
    }
  };

  const updateProject = () => {
    if (editingProject) {
      setData((prev) => ({ ...prev, projects: prev.projects.map((p) => (p.id === editingProject.id ? editingProject : p)) }));
      setShowEditProjectModal(false);
      setEditingProject(null);
    }
  };

  const deleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project? All associated tasks will also be removed.")) {
      setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== projectId), tasks: prev.tasks.filter((t) => t.projectId !== projectId) }));
    }
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }));
    }
  };

  const statusColors = { "Not Started": "#64748b", "In Progress": "#3b82f6", Blocked: "#ef4444", Completed: "#a7192e" };
  const priorityColors = { High: "#ef4444", Medium: "#f59e0b", Low: "#a7192e" };
  const colorOptions = ["#3b82f6", "#a7192e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .card-hover { transition: all 0.3s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); }
    @media (max-width: 768px) {
      .card-hover:hover { transform: none; }
      .hide-mobile { display: none !important; }
      .mobile-full { width: 100% !important; min-width: 0 !important; }
      .mobile-stack { flex-direction: column !important; }
      .mobile-grid-1 { grid-template-columns: 1fr !important; }
      .mobile-padding { padding: 1rem !important; }
      .mobile-text-sm { font-size: 0.875rem !important; }
      .mobile-gap-sm { gap: 0.5rem !important; }
    }
    @media (max-width: 480px) {
      .xs-text-xs { font-size: 0.75rem !important; }
      .xs-padding { padding: 0.75rem !important; }
    }
    input, select, textarea { font-size: 16px !important; }
  `;

  const cardStyle = { background: "rgba(30, 41, 59, 0.6)", backdropFilter: "blur(10px)", border: "2px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "1.5rem" };
  const buttonPrimary = { padding: "0.75rem 1.5rem", background: "linear-gradient(135deg, #a7192e 0%, #8b1525 100%)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit", minHeight: "44px" };
  const inputStyle = { width: "100%", padding: "0.75rem", background: "rgba(15, 23, 42, 0.6)", border: "2px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", color: "#fff", fontSize: "16px", fontFamily: "inherit", minHeight: "44px" };
  const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem", overflowY: "auto" };
  const modalContent = { background: "rgba(30, 41, 59, 0.98)", backdropFilter: "blur(20px)", border: "2px solid rgba(148, 163, 184, 0.3)", borderRadius: "20px", padding: "1.5rem", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", margin: "auto" };
  const touchButton = { minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)", fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}>
      <style>{styles}</style>

      {/* Header */}
      <header style={{ background: "rgba(26, 26, 26, 0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", padding: "1rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #a7192e 0%, #8b1525 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Target size={22} color="#fff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: "clamp(1rem, 4vw, 1.25rem)", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>TSH Vision Tracker</h1>
              <p className="hide-mobile" style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>{currentUser.role === "administrator" ? "Admin Dashboard" : "Employee Portal"}</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="hide-desktop" style={{ ...touchButton, background: "rgba(148, 163, 184, 0.1)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", display: "none" }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <style>{`@media (max-width: 768px) { .hide-desktop { display: flex !important; } .desktop-nav { display: none !important; } }`}</style>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {currentUser.role === "administrator" ? (
              [{ id: "vision", label: "Vision", icon: Target }, { id: "all-tasks", label: "Tasks", icon: CheckCircle2 }, { id: "team", label: "Team", icon: Users }, { id: "insights", label: "Insights", icon: BarChart3 }].map((view) => (
                <button key={view.id} onClick={() => setActiveView(view.id)} style={{ ...touchButton, padding: "0.5rem 0.75rem", borderRadius: "8px", border: "none", background: activeView === view.id ? "linear-gradient(135deg, #a7192e 0%, #8b1525 100%)" : "rgba(148, 163, 184, 0.1)", color: activeView === view.id ? "#fff" : "#cbd5e1", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", gap: "0.4rem" }}>
                  <view.icon size={16} /> <span className="hide-mobile">{view.label}</span>
                </button>
              ))
            ) : (
              [{ id: "my-tasks", label: "My Tasks", icon: CheckCircle2 }, { id: "my-progress", label: "Progress", icon: TrendingUp }].map((view) => (
                <button key={view.id} onClick={() => setActiveView(view.id)} style={{ ...touchButton, padding: "0.5rem 0.75rem", borderRadius: "8px", border: "none", background: activeView === view.id ? "linear-gradient(135deg, #a7192e 0%, #8b1525 100%)" : "rgba(148, 163, 184, 0.1)", color: activeView === view.id ? "#fff" : "#cbd5e1", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", gap: "0.4rem" }}>
                  <view.icon size={16} /> <span className="hide-mobile">{view.label}</span>
                </button>
              ))
            )}
            <div style={{ marginLeft: "0.25rem", paddingLeft: "0.5rem", borderLeft: "1px solid rgba(148, 163, 184, 0.2)" }}>
              <select value={currentUser.id} onChange={(e) => { const newUser = data.users.find((u) => u.id === e.target.value); setCurrentUser(newUser); setActiveView(newUser.role === "administrator" ? "vision" : "my-tasks"); }} style={{ background: "rgba(148, 163, 184, 0.1)", border: "none", color: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "0.5rem", borderRadius: "8px", minHeight: "44px" }}>
                {data.users.map((user) => (<option key={user.id} value={user.id} style={{ background: "#1e293b", color: "#fff" }}>{user.name.split(" ")[0]}</option>))}
              </select>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(26, 26, 26, 0.98)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", padding: "1rem", display: "grid", gap: "0.5rem" }}>
            {(currentUser.role === "administrator" 
              ? [{ id: "vision", label: "Vision", icon: Target }, { id: "all-tasks", label: "Tasks", icon: CheckCircle2 }, { id: "team", label: "Team", icon: Users }, { id: "insights", label: "Insights", icon: BarChart3 }]
              : [{ id: "my-tasks", label: "My Tasks", icon: CheckCircle2 }, { id: "my-progress", label: "Progress", icon: TrendingUp }]
            ).map((view) => (
              <button key={view.id} onClick={() => { setActiveView(view.id); setMobileMenuOpen(false); }} style={{ ...touchButton, width: "100%", padding: "1rem", borderRadius: "10px", border: "none", background: activeView === view.id ? "linear-gradient(135deg, #a7192e 0%, #8b1525 100%)" : "rgba(148, 163, 184, 0.1)", color: activeView === view.id ? "#fff" : "#cbd5e1", fontSize: "1rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", justifyContent: "flex-start", gap: "0.75rem" }}>
                <view.icon size={20} /> {view.label}
              </button>
            ))}
            <select value={currentUser.id} onChange={(e) => { const newUser = data.users.find((u) => u.id === e.target.value); setCurrentUser(newUser); setActiveView(newUser.role === "administrator" ? "vision" : "my-tasks"); setMobileMenuOpen(false); }} style={{ ...inputStyle, marginTop: "0.5rem" }}>
              {data.users.map((user) => (<option key={user.id} value={user.id} style={{ background: "#1e293b", color: "#fff" }}>{user.name} ({user.role === "administrator" ? "Admin" : "Employee"})</option>))}
            </select>
          </div>
        )}
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(1rem, 4vw, 2rem)" }}>
        {/* Vision Board */}
        {activeView === "vision" && (
          <div>
            {/* North Star */}
            <div style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)", border: "2px solid rgba(59, 130, 246, 0.3)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 3rem)", marginBottom: "2rem", position: "relative" }}>
              <button onClick={() => { setEditedNorthStar(data.northStar); setShowEditNorthStar(true); }} style={{ ...touchButton, position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "8px", color: "#8b1525", cursor: "pointer" }}>
                <Edit2 size={16} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)", flexShrink: 0 }}>
                  <Rocket size={26} strokeWidth={2} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>North Star 2026</div>
                  <h2 style={{ margin: 0, fontSize: "clamp(1.5rem, 5vw, 2.5rem)", fontWeight: 800, background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", wordBreak: "break-word" }}>{data.northStar}</h2>
                </div>
              </div>
            </div>

            {/* Goals Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "clamp(1.125rem, 4vw, 1.5rem)", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}><Target size={22} /> Strategic Goals</h3>
              <button onClick={() => setShowAddGoalModal(true)} style={{ ...buttonPrimary, padding: "0.6rem 1rem", fontSize: "0.8rem" }}><Plus size={16} /> Add Goal</button>
            </div>

            {/* Goals Grid */}
            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {data.goals.map((goal) => {
                const progress = calculateGoalProgress(goal.id);
                const goalProjects = data.projects.filter((p) => p.goalId === goal.id);
                return (
                  <div key={goal.id} className="card-hover" style={{ ...cardStyle, padding: "clamp(1rem, 3vw, 1.5rem)", border: `2px solid ${selectedGoal === goal.id ? goal.color : "rgba(148, 163, 184, 0.2)"}`, position: "relative" }}>
                    <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", gap: "0.25rem", zIndex: 10 }}>
                      <button onClick={() => { setEditingGoal(goal); setShowEditGoalModal(true); }} style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "8px", color: "#8b1525", cursor: "pointer" }}><Edit2 size={14} /></button>
                      <button onClick={() => deleteGoal(goal.id)} style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", color: "#ef4444", cursor: "pointer" }}><Trash2 size={14} /></button>
                    </div>
                    <div style={{ paddingRight: "5rem", marginBottom: "1rem" }}>
                      <h4 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem" }}>{goal.name}</h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4 }}>{goal.description}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: `${goal.color}15`, border: `2px solid ${goal.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: goal.color }}>{progress}%</div>
                      </div>
                    </div>
                    <div style={{ height: "8px", background: "rgba(148, 163, 184, 0.1)", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
                      <div style={{ height: "100%", background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}dd 100%)`, width: `${progress}%`, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#cbd5e1" }}><TrendingUp size={14} /> {goalProjects.length} Projects</div>
                      <button onClick={() => { setNewProject({ ...newProject, goalId: goal.id }); setShowAddProjectModal(true); }} style={{ ...touchButton, padding: "0.4rem 0.75rem", background: `${goal.color}20`, border: `1px solid ${goal.color}40`, borderRadius: "6px", color: goal.color, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Add Project</button>
                    </div>
                    {goalProjects.length > 0 && (
                      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        {goalProjects.map((project) => (
                          <div key={project.id} style={{ padding: "0.875rem", background: "rgba(15, 23, 42, 0.4)", borderRadius: "10px", marginBottom: "0.5rem", position: "relative" }}>
                            <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.25rem" }}>
                              <button onClick={() => { setEditingProject(project); setShowEditProjectModal(true); }} style={{ ...touchButton, width: "32px", height: "32px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "6px", color: "#8b1525", cursor: "pointer" }}><Edit2 size={12} /></button>
                              <button onClick={() => deleteProject(project.id)} style={{ ...touchButton, width: "32px", height: "32px", background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "6px", color: "#ef4444", cursor: "pointer" }}><Trash2 size={12} /></button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", paddingRight: "4.5rem" }}>
                              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{project.name}</span>
                              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: goal.color }}>{project.progress}%</span>
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.5rem" }}>{project.description}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", flexWrap: "wrap", gap: "0.5rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#cbd5e1" }}><Users size={12} /> {project.owner}</div>
                              <div style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", background: `${goal.color}20`, color: goal.color, fontWeight: 600 }}>{project.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Management */}
        {currentUser.role === "administrator" && activeView === "team" && (
          <div>
            <h3 style={{ fontSize: "clamp(1.125rem, 4vw, 1.5rem)", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Users size={22} /> Team Management</h3>
            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {data.users.filter((user) => user.role === "employee").map((employee) => {
                const employeeTasks = data.tasks.filter((t) => t.assignedTo === employee.name);
                const stats = { total: employeeTasks.length, completed: employeeTasks.filter((t) => t.status === "Completed").length, inProgress: employeeTasks.filter((t) => t.status === "In Progress").length, notStarted: employeeTasks.filter((t) => t.status === "Not Started").length, overdue: employeeTasks.filter((t) => t.dueDate && t.status !== "Completed" && new Date(t.dueDate) < new Date()).length };
                const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <div key={employee.id} className="card-hover" onClick={() => setActiveView("all-tasks")} style={{ ...cardStyle, cursor: "pointer", padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #a7192e 0%, #8b1525 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, flexShrink: 0 }}>{employee.name.split(" ").map((n) => n[0]).join("").toUpperCase()}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{employee.name}</h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{employee.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div style={{ padding: "0.6rem", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#8b1525" }}>{stats.total}</div>
                        <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Total</div>
                      </div>
                      <div style={{ padding: "0.6rem", background: "rgba(167, 25, 46, 0.1)", border: "1px solid rgba(167, 25, 46, 0.2)", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#a7192e" }}>{stats.completed}</div>
                        <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Done</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Completion</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a7192e" }}>{completionRate}%</span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(148, 163, 184, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "linear-gradient(90deg, #a7192e 0%, #8b1525 100%)", width: `${completionRate}%` }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#94a3b8", paddingTop: "0.75rem", borderTop: "1px solid rgba(148, 163, 184, 0.1)", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div><span style={{ color: "#8b1525", fontWeight: 600 }}>{stats.inProgress}</span> Active</div>
                      <div><span style={{ color: "#64748b", fontWeight: 600 }}>{stats.notStarted}</span> Pending</div>
                      {stats.overdue > 0 && <div><span style={{ color: "#ef4444", fontWeight: 600 }}>{stats.overdue}</span> Overdue</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights */}
        {currentUser.role === "administrator" && activeView === "insights" && (
          <div>
            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Overall Progress", value: `${Math.round(data.goals.reduce((sum, g) => sum + calculateGoalProgress(g.id), 0) / data.goals.length)}%`, color: "#8b1525", bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.3)", desc: "Towards North Star" },
                { label: "Active Projects", value: data.projects.length, color: "#a7192e", bg: "rgba(167, 25, 46, 0.2)", border: "rgba(167, 25, 46, 0.3)", desc: `Across ${data.goals.length} Goals` },
                { label: "Total Tasks", value: data.tasks.length, color: "#c92136", bg: "rgba(245, 158, 11, 0.2)", border: "rgba(245, 158, 11, 0.3)", desc: `${data.tasks.filter((t) => t.status === "Completed").length} Completed` }
              ].map((item) => (
                <div key={item.label} className="card-hover" style={{ background: `linear-gradient(135deg, ${item.bg} 0%, ${item.bg.replace("0.2", "0.1")} 100%)`, border: `2px solid ${item.border}`, borderRadius: "16px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.4rem", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 800, color: item.color, marginBottom: "0.25rem" }}>{item.value}</div>
                  <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="card-hover" style={cardStyle}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><BarChart3 size={22} /> Goal Performance</h3>
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {data.goals.map((goal) => {
                  const progress = calculateGoalProgress(goal.id);
                  const projectCount = data.projects.filter((p) => p.goalId === goal.id).length;
                  return (
                    <div key={goal.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div>
                          <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.15rem" }}>{goal.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{projectCount} {projectCount === 1 ? "Project" : "Projects"}</div>
                        </div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: goal.color }}>{progress}%</div>
                      </div>
                      <div style={{ height: "10px", background: "rgba(148, 163, 184, 0.1)", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{ height: "100%", background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}dd 100%)`, width: `${progress}%`, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {((currentUser.role === "administrator" && activeView === "all-tasks") || (currentUser.role === "employee" && activeView === "my-tasks")) && (
          <div>
            <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "clamp(1.125rem, 4vw, 1.5rem)", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={22} /> {currentUser.role === "administrator" ? "All Tasks" : "My Tasks"}</h3>
              {currentUser.role === "administrator" && <button onClick={() => setShowAddTaskModal(true)} style={{ ...buttonPrimary, padding: "0.6rem 1rem", fontSize: "0.8rem" }}><Plus size={16} /> Add Task</button>}
            </div>
            
            {/* Filters */}
            <div className="mobile-stack" style={{ ...cardStyle, marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "stretch", padding: "1rem" }}>
              <div className="mobile-full" style={{ flex: "1 1 250px", position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: "2.5rem" }} />
              </div>
              <div className="mobile-full mobile-stack" style={{ display: "flex", gap: "0.5rem", alignItems: "center", flex: "0 0 auto" }}>
                <Filter size={16} color="#94a3b8" className="hide-mobile" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="mobile-full" style={{ ...inputStyle, flex: "1 1 auto", minWidth: "120px" }}>
                  <option value="all">All Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="mobile-full" style={{ ...inputStyle, flex: "1 1 auto", minWidth: "120px" }}>
                  <option value="all">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Task Cards */}
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {getFilteredTasks().map((task) => {
                const project = data.projects.find((p) => p.id === task.projectId);
                const isEditing = editingTask === task.id;
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";
                return (
                  <div key={task.id} className="card-hover" style={{ ...cardStyle, border: `2px solid ${isOverdue ? "#ef4444" : "rgba(148, 163, 184, 0.2)"}`, padding: "1rem" }}>
                    <div className="mobile-stack" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${statusColors[task.status]}20`, border: `2px solid ${statusColors[task.status]}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {task.status === "Completed" ? <CheckCircle2 size={20} color={statusColors[task.status]} /> : task.status === "In Progress" ? <Clock size={20} color={statusColors[task.status]} /> : <Circle size={20} color={statusColors[task.status]} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.5rem" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span style={{ wordBreak: "break-word" }}>{task.name}</span>
                              {isOverdue && <span style={{ padding: "0.15rem 0.4rem", background: "rgba(239, 68, 68, 0.2)", borderRadius: "4px", color: "#ef4444", fontSize: "0.65rem", whiteSpace: "nowrap" }}>OVERDUE</span>}
                            </h4>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4 }}>{task.description}</p>
                          </div>
                          {!isEditing && (
                            <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                              <button onClick={() => setShowDocLinksModal(task.id)} style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(168, 85, 247, 0.2)", border: "1px solid rgba(168, 85, 247, 0.4)", borderRadius: "8px", color: "#a855f7", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, flexDirection: "column", gap: "0" }}><MessageSquare size={14} /><span style={{ fontSize: "0.6rem" }}>{task.documentLinks?.length || 0}</span></button>
                              <button onClick={() => setEditingTask(task.id)} style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "8px", color: "#8b1525", cursor: "pointer" }}><Edit2 size={14} /></button>
                              <button onClick={() => deleteTask(task.id)} style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", color: "#ef4444", cursor: "pointer" }}><Trash2 size={14} /></button>
                            </div>
                          )}
                        </div>
                        <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem", marginBottom: isEditing ? "1rem" : 0 }}>
                          <div>
                            <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", textTransform: "uppercase", fontWeight: 600 }}>Project</div>
                            <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{project?.name || "—"}</div>
                          </div>
                          {!isEditing ? (
                            <>
                              <div>
                                <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", textTransform: "uppercase", fontWeight: 600 }}>Status</div>
                                <div style={{ display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: "4px", background: `${statusColors[task.status]}20`, color: statusColors[task.status], fontSize: "0.7rem", fontWeight: 700 }}>{task.status}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", textTransform: "uppercase", fontWeight: 600 }}>Priority</div>
                                <div style={{ display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: "4px", background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority], fontSize: "0.7rem", fontWeight: 700 }}>{task.priority}</div>
                              </div>
                              {task.assignedTo && <div><div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", textTransform: "uppercase", fontWeight: 600 }}>Assigned</div><div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{task.assignedTo}</div></div>}
                              {task.dueDate && <div><div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", textTransform: "uppercase", fontWeight: 600 }}>Due</div><div style={{ fontSize: "0.8rem", color: isOverdue ? "#ef4444" : "#cbd5e1" }}>{new Date(task.dueDate).toLocaleDateString()}</div></div>}
                            </>
                          ) : (
                            <>
                              <div>
                                <label style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Status</label>
                                <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })} style={{ ...inputStyle, padding: "0.5rem", fontSize: "14px" }}>
                                  <option value="Not Started">Not Started</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Priority</label>
                                <select value={task.priority} onChange={(e) => updateTask(task.id, { priority: e.target.value })} style={{ ...inputStyle, padding: "0.5rem", fontSize: "14px" }}>
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Assigned To</label>
                                <select value={task.assignedTo || ""} onChange={(e) => updateTask(task.id, { assignedTo: e.target.value })} style={{ ...inputStyle, padding: "0.5rem", fontSize: "14px" }}>
                                  <option value="">Unassigned</option>
                                  {data.users.filter((u) => u.role === "employee").map((emp) => (<option key={emp.id} value={emp.name}>{emp.name}</option>))}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.2rem", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Due Date</label>
                                <input type="date" value={task.dueDate || ""} onChange={(e) => updateTask(task.id, { dueDate: e.target.value })} style={{ ...inputStyle, padding: "0.5rem", fontSize: "14px" }} />
                              </div>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <button onClick={() => setEditingTask(null)} style={{ ...buttonPrimary, padding: "0.5rem 1rem", fontSize: "0.8rem" }}><Save size={14} /> Save</button>
                            <button onClick={() => setEditingTask(null)} style={{ ...touchButton, padding: "0.5rem 1rem", background: "rgba(148, 163, 184, 0.2)", border: "1px solid rgba(148, 163, 184, 0.3)", borderRadius: "8px", color: "#cbd5e1", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {getFilteredTasks().length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
                  <CheckCircle2 size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
                  <p style={{ fontSize: "1rem", fontWeight: 500 }}>No tasks found</p>
                  <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Try adjusting your filters or add a new task</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employee Progress View */}
        {currentUser.role === "employee" && activeView === "my-progress" && (() => {
          const myTasks = data.tasks.filter((t) => t.assignedTo === currentUser.name);
          const stats = { total: myTasks.length, completed: myTasks.filter((t) => t.status === "Completed").length, inProgress: myTasks.filter((t) => t.status === "In Progress").length, notStarted: myTasks.filter((t) => t.status === "Not Started").length, overdue: myTasks.filter((t) => t.dueDate && t.status !== "Completed" && new Date(t.dueDate) < new Date()).length };
          const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          return (
            <div>
              <h3 style={{ fontSize: "clamp(1.125rem, 4vw, 1.5rem)", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><TrendingUp size={22} /> My Progress</h3>
              <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[{ label: "Total", value: stats.total, color: "#8b1525", bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.3)" },
                  { label: "Done", value: stats.completed, color: "#a7192e", bg: "rgba(167, 25, 46, 0.2)", border: "rgba(167, 25, 46, 0.3)" },
                  { label: "Active", value: stats.inProgress, color: "#c92136", bg: "rgba(245, 158, 11, 0.2)", border: "rgba(245, 158, 11, 0.3)" },
                  { label: "Overdue", value: stats.overdue, color: "#ef4444", bg: "rgba(239, 68, 68, 0.2)", border: "rgba(239, 68, 68, 0.3)" }
                ].map((item) => (
                  <div key={item.label} className="card-hover" style={{ background: `linear-gradient(135deg, ${item.bg} 0%, ${item.bg.replace("0.2", "0.1")} 100%)`, border: `2px solid ${item.border}`, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)", fontWeight: 800, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="card-hover" style={cardStyle}>
                <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>Completion Rate</h4>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Overall Progress</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#a7192e" }}>{completionRate}%</span>
                  </div>
                  <div style={{ height: "12px", background: "rgba(148, 163, 184, 0.1)", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg, #a7192e 0%, #8b1525 100%)", width: `${completionRate}%`, transition: "width 1s ease" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  {[{ label: "Completed", value: stats.completed, color: "#a7192e" }, { label: "In Progress", value: stats.inProgress, color: "#8b1525" }, { label: "Pending", value: stats.notStarted, color: "#64748b" }].map((item) => (
                    <div key={item.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.125rem", fontWeight: 700, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </main>

      {/* Modals */}
      {showEditNorthStar && (
        <div style={modalOverlay}>
          <div style={{ ...modalContent, maxWidth: "450px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Rocket size={22} /> Edit North Star</h3>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>North Star Statement</label>
              <input type="text" value={editedNorthStar} onChange={(e) => setEditedNorthStar(e.target.value)} style={inputStyle} />
            </div>
            <div className="mobile-stack" style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={updateNorthStar} className="mobile-full" style={{ ...buttonPrimary, flex: 1, justifyContent: "center" }}>Update</button>
              <button onClick={() => setShowEditNorthStar(false)} className="mobile-full" style={{ flex: 1, padding: "0.75rem", background: "rgba(148, 163, 184, 0.2)", border: "2px solid rgba(148, 163, 184, 0.3)", borderRadius: "10px", color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {(showAddGoalModal || showEditGoalModal) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Target size={22} /> {showAddGoalModal ? "Add New Goal" : "Edit Goal"}</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Goal Name *</label>
                <input type="text" value={showAddGoalModal ? newGoal.name : editingGoal?.name || ""} onChange={(e) => showAddGoalModal ? setNewGoal({ ...newGoal, name: e.target.value }) : setEditingGoal({ ...editingGoal, name: e.target.value })} placeholder="Enter goal name" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Description *</label>
                <textarea value={showAddGoalModal ? newGoal.description : editingGoal?.description || ""} onChange={(e) => showAddGoalModal ? setNewGoal({ ...newGoal, description: e.target.value }) : setEditingGoal({ ...editingGoal, description: e.target.value })} placeholder="Enter goal description" rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Color</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                  {colorOptions.map((color) => (
                    <button key={color} onClick={() => showAddGoalModal ? setNewGoal({ ...newGoal, color }) : setEditingGoal({ ...editingGoal, color })} style={{ ...touchButton, width: "100%", height: "44px", borderRadius: "8px", background: color, border: (showAddGoalModal ? newGoal.color : editingGoal?.color) === color ? "3px solid #fff" : "2px solid rgba(148, 163, 184, 0.3)", cursor: "pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mobile-stack" style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={showAddGoalModal ? addNewGoal : updateGoal} className="mobile-full" style={{ ...buttonPrimary, flex: 1, justifyContent: "center" }}>{showAddGoalModal ? "Create Goal" : "Update Goal"}</button>
              <button onClick={() => { showAddGoalModal ? setShowAddGoalModal(false) : setShowEditGoalModal(false); setNewGoal({ name: "", description: "", color: "#8b1525" }); setEditingGoal(null); }} className="mobile-full" style={{ flex: 1, padding: "0.75rem", background: "rgba(148, 163, 184, 0.2)", border: "2px solid rgba(148, 163, 184, 0.3)", borderRadius: "10px", color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {(showAddProjectModal || showEditProjectModal) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>{showAddProjectModal ? "Add New Project" : "Edit Project"}</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Project Name *</label>
                <input type="text" value={showAddProjectModal ? newProject.name : editingProject?.name || ""} onChange={(e) => showAddProjectModal ? setNewProject({ ...newProject, name: e.target.value }) : setEditingProject({ ...editingProject, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Description *</label>
                <textarea value={showAddProjectModal ? newProject.description : editingProject?.description || ""} onChange={(e) => showAddProjectModal ? setNewProject({ ...newProject, description: e.target.value }) : setEditingProject({ ...editingProject, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Goal *</label>
                <select value={showAddProjectModal ? newProject.goalId : editingProject?.goalId || ""} onChange={(e) => showAddProjectModal ? setNewProject({ ...newProject, goalId: e.target.value }) : setEditingProject({ ...editingProject, goalId: e.target.value })} style={inputStyle}>
                  <option value="">Select Goal</option>
                  {data.goals.map((goal) => (<option key={goal.id} value={goal.id}>{goal.name}</option>))}
                </select>
              </div>
              <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Owner</label>
                  <select value={showAddProjectModal ? newProject.owner : editingProject?.owner || ""} onChange={(e) => showAddProjectModal ? setNewProject({ ...newProject, owner: e.target.value }) : setEditingProject({ ...editingProject, owner: e.target.value })} style={inputStyle}>
                    <option value="">Select Owner</option>
                    {data.users.filter((u) => u.role === "employee").map((emp) => (<option key={emp.id} value={emp.name}>{emp.name}</option>))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Status</label>
                  <select value={showAddProjectModal ? newProject.status : editingProject?.status || "Planning"} onChange={(e) => showAddProjectModal ? setNewProject({ ...newProject, status: e.target.value }) : setEditingProject({ ...editingProject, status: e.target.value })} style={inputStyle}>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Progress (%)</label>
                <input type="number" min="0" max="100" value={showAddProjectModal ? newProject.progress : editingProject?.progress || 0} onChange={(e) => showAddProjectModal ? setNewProject({ ...newProject, progress: parseInt(e.target.value) || 0 }) : setEditingProject({ ...editingProject, progress: parseInt(e.target.value) || 0 })} style={inputStyle} />
              </div>
            </div>
            <div className="mobile-stack" style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={showAddProjectModal ? addNewProject : updateProject} className="mobile-full" style={{ ...buttonPrimary, flex: 1, justifyContent: "center" }}>{showAddProjectModal ? "Create Project" : "Update Project"}</button>
              <button onClick={() => { showAddProjectModal ? setShowAddProjectModal(false) : setShowEditProjectModal(false); setNewProject({ name: "", description: "", goalId: "", owner: "", status: "Planning", progress: 0 }); setEditingProject(null); }} className="mobile-full" style={{ flex: 1, padding: "0.75rem", background: "rgba(148, 163, 184, 0.2)", border: "2px solid rgba(148, 163, 184, 0.3)", borderRadius: "10px", color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddTaskModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={22} /> Add New Task</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Task Name *</label>
                <input type="text" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} placeholder="Enter task name" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Description *</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Enter task description" rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Project *</label>
                <select value={newTask.projectId} onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })} style={inputStyle}>
                  <option value="">Select Project</option>
                  {data.projects.map((proj) => (<option key={proj.id} value={proj.id}>{proj.name}</option>))}
                </select>
              </div>
              <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} style={inputStyle}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Status</label>
                  <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} style={inputStyle}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Assign To</label>
                <select value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} style={inputStyle}>
                  <option value="">Unassigned</option>
                  {data.users.filter((u) => u.role === "employee").map((emp) => (<option key={emp.id} value={emp.name}>{emp.name}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Due Date</label>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div className="mobile-stack" style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={addNewTask} disabled={!newTask.name || !newTask.description || !newTask.projectId} className="mobile-full" style={{ ...buttonPrimary, flex: 1, justifyContent: "center", opacity: (!newTask.name || !newTask.description || !newTask.projectId) ? 0.5 : 1, cursor: (!newTask.name || !newTask.description || !newTask.projectId) ? "not-allowed" : "pointer" }}><Plus size={16} /> Create Task</button>
              <button onClick={() => { setShowAddTaskModal(false); setNewTask({ name: "", description: "", projectId: "", assignedTo: "", dueDate: "", priority: "Medium", status: "Not Started" }); }} className="mobile-full" style={{ flex: 1, padding: "0.75rem", background: "rgba(148, 163, 184, 0.2)", border: "2px solid rgba(148, 163, 184, 0.3)", borderRadius: "10px", color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDocLinksModal && (() => {
        const task = data.tasks.find((t) => t.id === showDocLinksModal);
        const project = data.projects.find((p) => p.id === task?.projectId);
        const goal = data.goals.find((g) => g.id === project?.goalId);
        return (
          <div style={modalOverlay}>
            <div style={{ ...modalContent, maxWidth: "550px" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><MessageSquare size={22} /> Document Links</h3>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                  <span style={{ color: goal?.color }}>{goal?.name}</span>
                  <span>›</span>
                  <span style={{ color: "#cbd5e1" }}>{project?.name}</span>
                  <span>›</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{task?.name}</span>
                </div>
              </div>
              <div style={{ background: "rgba(168, 85, 247, 0.1)", border: "2px solid rgba(168, 85, 247, 0.3)", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem", color: "#a855f7" }}>Add Google Drive Link</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <input type="text" value={newDocLink.name} onChange={(e) => setNewDocLink({ ...newDocLink, name: e.target.value })} placeholder="Document name" style={inputStyle} />
                  <input type="url" value={newDocLink.url} onChange={(e) => setNewDocLink({ ...newDocLink, url: e.target.value })} placeholder="https://drive.google.com/..." style={inputStyle} />
                  <button onClick={() => addDocumentLink(showDocLinksModal)} disabled={!newDocLink.name || !newDocLink.url} style={{ ...buttonPrimary, width: "100%", justifyContent: "center", background: (!newDocLink.name || !newDocLink.url) ? "rgba(148, 163, 184, 0.2)" : "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)", cursor: (!newDocLink.name || !newDocLink.url) ? "not-allowed" : "pointer" }}><Plus size={16} /> Add Link</button>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Linked Documents</span>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>{task?.documentLinks?.length || 0}</span>
                </h4>
                {task?.documentLinks && task.documentLinks.length > 0 ? (
                  <div style={{ display: "grid", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                    {task.documentLinks.map((link) => (
                      <div key={link.id} style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "8px", padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.name}</div>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem", color: "#8b1525", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</a>
                        </div>
                        <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "8px", color: "#8b1525", textDecoration: "none" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                          <button onClick={() => removeDocumentLink(showDocLinksModal, link.id)} style={{ ...touchButton, width: "36px", height: "36px", background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", color: "#ef4444", cursor: "pointer" }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#64748b" }}>
                    <MessageSquare size={36} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
                    <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>No documents linked yet</p>
                  </div>
                )}
              </div>
              <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <button onClick={() => { setShowDocLinksModal(null); setNewDocLink({ name: "", url: "" }); }} style={{ width: "100%", padding: "0.75rem", background: "rgba(148, 163, 184, 0.2)", border: "2px solid rgba(148, 163, 184, 0.3)", borderRadius: "10px", color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS: 'classroomify_users',
  COURSES: 'classroomify_courses',
  ENROLLMENTS: 'classroomify_enrollments',
  PROGRESS: 'classroomify_progress',
  SESSION: 'classroomify_session',
};

const DEMO_DATA = {
  users: [
    { id: 'user_demo', name: 'Ken Panie', email: 'demo@classroomify.com', password: 'demo1234', avatar: '🎓', xp: 1240 },
    { id: 'user_sarah', name: 'Sarah Chen', email: 'sarah@classroomify.com', password: 'demo1234', avatar: '⭐', xp: 980 },
    { id: 'user_marcus', name: 'Marcus Johnson', email: 'marcus@classroomify.com', password: 'demo1234', avatar: '🏆', xp: 1580 },
    { id: 'user_priya', name: 'Priya Patel', email: 'priya@classroomify.com', password: 'demo1234', avatar: '📚', xp: 2100 },
    { id: 'user_leo', name: 'Leo Martinez', email: 'leo@classroomify.com', password: 'demo1234', avatar: '💼', xp: 760 },
  ],
  courses: [
    { id: 'course_1', title: 'Introduction to React Native', subject: 'Mobile Development', color: '#4285F4', emoji: '📱', instructor: 'Prof. Kim', totalLessons: 12, description: 'Build cross-platform apps with React Native from scratch.' },
    { id: 'course_2', title: 'UI/UX Design Fundamentals', subject: 'Design', color: '#EA4335', emoji: '🎨', instructor: 'Prof. Morgan', totalLessons: 8, description: 'Learn design thinking and create beautiful user interfaces.' },
    { id: 'course_3', title: 'Data Structures & Algorithms', subject: 'Computer Science', color: '#34A853', emoji: '💻', instructor: 'Prof. Tanaka', totalLessons: 15, description: 'Master essential computer science concepts.' },
    { id: 'course_4', title: 'Python for Machine Learning', subject: 'AI / ML', color: '#FBBC04', emoji: '⚙️', instructor: 'Prof. Singh', totalLessons: 10, description: 'Apply Python to real-world machine learning problems.' },
  ],
  enrollments: [
    { id: 'enr_1', userId: 'user_demo', courseId: 'course_1' },
    { id: 'enr_2', userId: 'user_demo', courseId: 'course_2' },
    { id: 'enr_3', userId: 'user_demo', courseId: 'course_3' },
    { id: 'enr_4', userId: 'user_sarah', courseId: 'course_1' },
    { id: 'enr_5', userId: 'user_marcus', courseId: 'course_1' },
    { id: 'enr_6', userId: 'user_priya', courseId: 'course_2' },
    { id: 'enr_7', userId: 'user_leo', courseId: 'course_3' },
  ],
  progress: [
    { id: 'prog_1', userId: 'user_demo', courseId: 'course_1', lessonsCompleted: 8, xpEarned: 400 },
    { id: 'prog_2', userId: 'user_demo', courseId: 'course_2', lessonsCompleted: 5, xpEarned: 250 },
    { id: 'prog_3', userId: 'user_demo', courseId: 'course_3', lessonsCompleted: 3, xpEarned: 150 },
    { id: 'prog_4', userId: 'user_sarah', courseId: 'course_1', lessonsCompleted: 6, xpEarned: 300 },
    { id: 'prog_5', userId: 'user_marcus', courseId: 'course_1', lessonsCompleted: 10, xpEarned: 500 },
    { id: 'prog_6', userId: 'user_priya', courseId: 'course_2', lessonsCompleted: 7, xpEarned: 350 },
    { id: 'prog_7', userId: 'user_leo', courseId: 'course_3', lessonsCompleted: 2, xpEarned: 100 },
  ],
};

class DatabaseService {
  async _get(key) {
    try { const d = await AsyncStorage.getItem(key); return d ? JSON.parse(d) : null; }
    catch (e) { return null; }
  }
  async _set(key, value) {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  async seedDemoData() {
    const existing = await this._get(KEYS.USERS);
    if (!existing || existing.length === 0) {
      await this._set(KEYS.USERS, DEMO_DATA.users);
      await this._set(KEYS.COURSES, DEMO_DATA.courses);
      await this._set(KEYS.ENROLLMENTS, DEMO_DATA.enrollments);
      await this._set(KEYS.PROGRESS, DEMO_DATA.progress);
    }
  }

  // AUTH
  async login(email, password) {
    await this.seedDemoData();
    const users = await this._get(KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { await this._set(KEYS.SESSION, { userId: user.id }); return { success: true, user }; }
    return { success: false, error: 'Invalid email or password' };
  }
  async register(name, email, password) {
    await this.seedDemoData();
    const users = await this._get(KEYS.USERS) || [];
    if (users.find(u => u.email === email)) return { success: false, error: 'Email already registered' };
    const avatars = ['🎓','⭐','🏆','📚','💼','🔬','🎨','📊'];
    const newUser = { id: 'user_' + Date.now(), name, email, password, avatar: avatars[Math.floor(Math.random()*avatars.length)], xp: 0 };
    users.push(newUser);
    await this._set(KEYS.USERS, users);
    await this._set(KEYS.SESSION, { userId: newUser.id });
    return { success: true, user: newUser };
  }
  async getSession() { return await this._get(KEYS.SESSION); }
  async logout() { await AsyncStorage.removeItem(KEYS.SESSION); }
  async getUserById(userId) { const users = await this._get(KEYS.USERS) || []; return users.find(u => u.id === userId) || null; }
  async updateUser(userId, updates) {
    const users = await this._get(KEYS.USERS) || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; await this._set(KEYS.USERS, users); return users[idx]; }
    return null;
  }

  // COURSES
  async getCourses() { return (await this._get(KEYS.COURSES)) || []; }
  async getCourseById(id) { const c = await this.getCourses(); return c.find(x => x.id === id) || null; }
  async addCourse(data) {
    const courses = await this.getCourses();
    const nc = { id: 'course_' + Date.now(), ...data, createdAt: new Date().toISOString() };
    courses.push(nc); await this._set(KEYS.COURSES, courses); return nc;
  }
  async deleteCourse(courseId) {
    await this._set(KEYS.COURSES, (await this.getCourses()).filter(c => c.id !== courseId));
    await this._set(KEYS.ENROLLMENTS, (await this._get(KEYS.ENROLLMENTS) || []).filter(e => e.courseId !== courseId));
    await this._set(KEYS.PROGRESS, (await this._get(KEYS.PROGRESS) || []).filter(p => p.courseId !== courseId));
  }

  // ENROLLMENTS
  async getEnrolledCourses(userId) {
    const enrollments = (await this._get(KEYS.ENROLLMENTS)) || [];
    const courses = await this.getCourses();
    return enrollments.filter(e => e.userId === userId).map(e => courses.find(c => c.id === e.courseId)).filter(Boolean);
  }
  async isEnrolled(userId, courseId) { return ((await this._get(KEYS.ENROLLMENTS)) || []).some(e => e.userId === userId && e.courseId === courseId); }
  async enrollInCourse(userId, courseId) {
    if (await this.isEnrolled(userId, courseId)) return { success: false, error: 'Already enrolled' };
    const enrollments = (await this._get(KEYS.ENROLLMENTS)) || [];
    enrollments.push({ id: 'enr_' + Date.now(), userId, courseId });
    await this._set(KEYS.ENROLLMENTS, enrollments);
    const progress = (await this._get(KEYS.PROGRESS)) || [];
    progress.push({ id: 'prog_' + Date.now(), userId, courseId, lessonsCompleted: 0, xpEarned: 0 });
    await this._set(KEYS.PROGRESS, progress);
    return { success: true };
  }

  // PROGRESS
  async getProgress(userId, courseId) {
    const all = (await this._get(KEYS.PROGRESS)) || [];
    if (courseId) return all.find(p => p.userId === userId && p.courseId === courseId) || null;
    return all.filter(p => p.userId === userId);
  }
  async completeLesson(userId, courseId) {
    const all = (await this._get(KEYS.PROGRESS)) || [];
    const idx = all.findIndex(p => p.userId === userId && p.courseId === courseId);
    const course = await this.getCourseById(courseId);
    if (idx !== -1) {
      if (course && all[idx].lessonsCompleted >= course.totalLessons) return { success: false, error: 'All lessons done!' };
      all[idx].lessonsCompleted += 1;
      all[idx].xpEarned += 50;
      await this._set(KEYS.PROGRESS, all);
      await this.addXP(userId, 50);
      return { success: true };
    }
    return { success: false, error: 'Not enrolled' };
  }
  async addXP(userId, amount) {
    const users = (await this._get(KEYS.USERS)) || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) { users[idx].xp = (users[idx].xp || 0) + amount; await this._set(KEYS.USERS, users); }
  }

  // LEADERBOARD
  async getLeaderboard() {
    const users = (await this._get(KEYS.USERS)) || [];
    const progress = (await this._get(KEYS.PROGRESS)) || [];
    return users.map(user => {
      const up = progress.filter(p => p.userId === user.id);
      return { id: user.id, name: user.name, avatar: user.avatar, xp: user.xp || 0, lessonsCompleted: up.reduce((s, p) => s + p.lessonsCompleted, 0), coursesEnrolled: up.length };
    }).sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
  }

  // STATS
  async getUserStats(userId) {
    const progressList = await this.getProgress(userId, null);
    const courses = await this.getCourses();
    const user = await this.getUserById(userId);
    let totalLessons = 0, completedCourses = 0;
    for (const p of progressList) {
      totalLessons += p.lessonsCompleted;
      const c = courses.find(x => x.id === p.courseId);
      if (c && p.lessonsCompleted >= c.totalLessons) completedCourses++;
    }
    return { xp: user?.xp || 0, totalLessons, enrolledCourses: progressList.length, completedCourses, streak: 7 };
  }
}

export default new DatabaseService();
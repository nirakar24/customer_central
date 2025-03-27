import { 
  users, type User, type InsertUser,
  customers, type Customer, type InsertCustomer,
  products, type Product, type InsertProduct,
  pipelineStages, type PipelineStage, type InsertPipelineStage,
  deals, type Deal, type InsertDeal,
  tasks, type Task, type InsertTask,
  tickets, type Ticket, type InsertTicket,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Pipeline Stage operations
  getPipelineStage(id: number): Promise<PipelineStage | undefined>;
  getPipelineStages(): Promise<PipelineStage[]>;
  createPipelineStage(stage: InsertPipelineStage): Promise<PipelineStage>;
  
  // Deal operations
  getDeal(id: number): Promise<Deal | undefined>;
  getDeals(): Promise<Deal[]>;
  getDealsByStage(stageId: number): Promise<Deal[]>;
  getDealsByCustomer(customerId: number): Promise<Deal[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasks(): Promise<Task[]>;
  getTasksByAssignee(assignedTo: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Ticket operations
  getTicket(id: number): Promise<Ticket | undefined>;
  getTickets(): Promise<Ticket[]>;
  getTicketsByCustomer(customerId: number): Promise<Ticket[]>;
  getTicketsByAssignee(assignedTo: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  deleteTicket(id: number): Promise<boolean>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivities(): Promise<Activity[]>;
  getActivitiesByRelated(relatedTo: string, relatedId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private products: Map<number, Product>;
  private pipelineStages: Map<number, PipelineStage>;
  private deals: Map<number, Deal>;
  private tasks: Map<number, Task>;
  private tickets: Map<number, Ticket>;
  private activities: Map<number, Activity>;
  
  private userId: number;
  private customerId: number;
  private productId: number;
  private pipelineStageId: number;
  private dealId: number;
  private taskId: number;
  private ticketId: number;
  private activityId: number;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.products = new Map();
    this.pipelineStages = new Map();
    this.deals = new Map();
    this.tasks = new Map();
    this.tickets = new Map();
    this.activities = new Map();
    
    this.userId = 1;
    this.customerId = 1;
    this.productId = 1;
    this.pipelineStageId = 1;
    this.dealId = 1;
    this.taskId = 1;
    this.ticketId = 1;
    this.activityId = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const currentDate = new Date();
    const user: User = { ...insertUser, id, createdAt: currentDate };
    this.users.set(id, user);
    return user;
  }
  
  // Customer operations
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }
  
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }
  
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerId++;
    const currentDate = new Date();
    const customer: Customer = { ...insertCustomer, id, createdAt: currentDate };
    this.customers.set(id, customer);
    return customer;
  }
  
  async updateCustomer(id: number, customerUpdate: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...customerUpdate };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
  
  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }
  
  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const currentDate = new Date();
    const product: Product = { ...insertProduct, id, createdAt: currentDate };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Pipeline stage operations
  async getPipelineStage(id: number): Promise<PipelineStage | undefined> {
    return this.pipelineStages.get(id);
  }
  
  async getPipelineStages(): Promise<PipelineStage[]> {
    return Array.from(this.pipelineStages.values()).sort((a, b) => a.order - b.order);
  }
  
  async createPipelineStage(insertStage: InsertPipelineStage): Promise<PipelineStage> {
    const id = this.pipelineStageId++;
    const currentDate = new Date();
    const stage: PipelineStage = { ...insertStage, id, createdAt: currentDate };
    this.pipelineStages.set(id, stage);
    return stage;
  }
  
  // Deal operations
  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }
  
  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }
  
  async getDealsByStage(stageId: number): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(deal => deal.stageId === stageId);
  }
  
  async getDealsByCustomer(customerId: number): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(deal => deal.customerId === customerId);
  }
  
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = this.dealId++;
    const currentDate = new Date();
    const deal: Deal = { ...insertDeal, id, createdAt: currentDate };
    this.deals.set(id, deal);
    return deal;
  }
  
  async updateDeal(id: number, dealUpdate: Partial<InsertDeal>): Promise<Deal | undefined> {
    const deal = this.deals.get(id);
    if (!deal) return undefined;
    
    const updatedDeal = { ...deal, ...dealUpdate };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  async deleteDeal(id: number): Promise<boolean> {
    return this.deals.delete(id);
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async getTasksByAssignee(assignedTo: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assignedTo === assignedTo);
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const currentDate = new Date();
    const task: Task = { ...insertTask, id, createdAt: currentDate };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Ticket operations
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }
  
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }
  
  async getTicketsByCustomer(customerId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.customerId === customerId);
  }
  
  async getTicketsByAssignee(assignedTo: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.assignedTo === assignedTo);
  }
  
  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketId++;
    const currentDate = new Date();
    const ticket: Ticket = { ...insertTicket, id, createdAt: currentDate };
    this.tickets.set(id, ticket);
    return ticket;
  }
  
  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, ...ticketUpdate };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }
  
  async deleteTicket(id: number): Promise<boolean> {
    return this.tickets.delete(id);
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).sort((a, b) => {
      // Sort by creation date descending
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async getActivitiesByRelated(relatedTo: string, relatedId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.relatedTo === relatedTo && activity.relatedId === relatedId)
      .sort((a, b) => {
        // Sort by creation date descending
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const currentDate = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt: currentDate };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create default admin user
    this.createUser({
      username: 'admin',
      password: 'admin123',
      fullName: 'Raj Mehta',
      email: 'raj.mehta@insightsync.com',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    // Create team members
    this.createUser({
      username: 'alisha',
      password: 'password123',
      fullName: 'Alisha Patel',
      email: 'alisha.patel@insightsync.com',
      role: 'sales',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    this.createUser({
      username: 'priya',
      password: 'password123',
      fullName: 'Priya Singh',
      email: 'priya.singh@insightsync.com',
      role: 'sales',
      avatarUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    this.createUser({
      username: 'arjun',
      password: 'password123',
      fullName: 'Arjun Kapoor',
      email: 'arjun.kapoor@insightsync.com',
      role: 'support',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    // Create pipeline stages
    this.createPipelineStage({
      name: 'Lead',
      order: 1,
      color: '#3B82F6' // blue
    });

    this.createPipelineStage({
      name: 'Contact',
      order: 2,
      color: '#3B82F6' // blue
    });

    this.createPipelineStage({
      name: 'Proposal',
      order: 3,
      color: '#3B82F6' // blue
    });

    this.createPipelineStage({
      name: 'Negotiation',
      order: 4,
      color: '#3B82F6' // blue
    });

    this.createPipelineStage({
      name: 'Closed Won',
      order: 5,
      color: '#22C55E' // green
    });

    // Create sample customers
    const techSolutions = this.createCustomer({
      name: 'TechSolutions Ltd.',
      company: 'TechSolutions Ltd.',
      email: 'contact@techsolutions.com',
      phone: '+91 9876543210',
      status: 'active',
      address: '123 Tech Park, Bangalore',
      avatarUrl: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      lastContact: new Date(),
      churnRisk: 2,
      totalRevenue: 240000
    });

    this.createCustomer({
      name: 'GlobalTrade Inc.',
      company: 'GlobalTrade Inc.',
      email: 'info@globaltrade.com',
      phone: '+91 9765432109',
      status: 'active',
      address: '456 Business Hub, Mumbai',
      avatarUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      churnRisk: 1,
      totalRevenue: 380000
    });
    
    this.createCustomer({
      name: 'Innovative Solutions',
      company: 'Innovative Solutions Pvt. Ltd.',
      email: 'support@innovativesol.com',
      phone: '+91 9654321098',
      status: 'active',
      address: '789 Innovation Center, Hyderabad',
      avatarUrl: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      churnRisk: 4,
      totalRevenue: 120000
    });
    
    this.createCustomer({
      name: 'Naveen Kumar',
      company: 'InnovateTech Solutions',
      email: 'naveen@innovatetech.com',
      phone: '+91 9543210987',
      status: 'lead',
      address: '101 Startup Street, Pune',
      avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      lastContact: new Date(),
      churnRisk: 0,
      totalRevenue: 0
    });
    
    // Create sample products
    this.createProduct({
      name: 'InsightSync Basic',
      description: 'Entry-level CRM solution for small businesses',
      price: 49900, // ₹49,900
      category: 'Software',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      inventory: 999,
      status: 'active'
    });
    
    this.createProduct({
      name: 'InsightSync Professional',
      description: 'Advanced CRM with analytics and automation for medium businesses',
      price: 149900, // ₹1,49,900
      category: 'Software',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      inventory: 999,
      status: 'active'
    });
    
    this.createProduct({
      name: 'InsightSync Enterprise',
      description: 'Comprehensive CRM solution for large enterprises with custom integrations',
      price: 299900, // ₹2,99,900
      category: 'Software',
      imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      inventory: 999,
      status: 'active'
    });
    
    this.createProduct({
      name: 'Implementation Services',
      description: 'Professional setup and configuration service with training',
      price: 75000, // ₹75,000
      category: 'Service',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      inventory: 999,
      status: 'active'
    });
    
    this.createProduct({
      name: 'Premium Support Plan',
      description: 'Priority support with dedicated account manager and 24/7 assistance',
      price: 120000, // ₹1,20,000
      category: 'Support',
      imageUrl: 'https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      inventory: 999,
      status: 'active'
    });
    
    // Create sample deals
    this.createDeal({
      title: 'TechSolutions CRM Implementation',
      customerId: 1, // TechSolutions
      value: 240000, // ₹2.4L
      stageId: 5, // Closed Won
      ownerId: 2, // Alisha
      expectedCloseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      probability: 100,
      status: 'won',
      notes: 'Successfully implemented InsightSync Professional with custom integrations.'
    });
    
    this.createDeal({
      title: 'GlobalTrade Enterprise Deployment',
      customerId: 2, // GlobalTrade
      value: 380000, // ₹3.8L
      stageId: 3, // Proposal
      ownerId: 1, // Raj
      expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      probability: 60,
      status: 'open',
      notes: 'Proposal sent for InsightSync Enterprise solution with Implementation Services.'
    });
    
    this.createDeal({
      title: 'Innovative Solutions Support Plan',
      customerId: 3, // Innovative Solutions
      value: 120000, // ₹1.2L
      stageId: 4, // Negotiation
      ownerId: 3, // Priya
      expectedCloseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      probability: 80,
      status: 'open',
      notes: 'Discussing Premium Support Plan renewal with additional services.'
    });
    
    this.createDeal({
      title: 'InnovateTech Initial Deployment',
      customerId: 4, // Naveen / InnovateTech
      value: 75000, // ₹0.75L
      stageId: 1, // Lead
      ownerId: 4, // Arjun
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      probability: 30,
      status: 'open',
      notes: 'Initial discussion about implementing InsightSync Basic.'
    });
    
    // Create sample tasks
    this.createTask({
      title: 'Follow up with GlobalTrade Inc. about proposal',
      description: 'Send additional information about implementation timeline and integration options',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      status: 'pending',
      priority: 'high',
      assignedTo: 1, // Raj
      relatedTo: 'deal',
      relatedId: 2 // GlobalTrade deal
    });
    
    this.createTask({
      title: 'Prepare quarterly report for management review',
      description: 'Compile Q3 performance metrics and sales forecasts',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'pending',
      priority: 'medium',
      assignedTo: 1, // Raj
      relatedTo: 'internal',
      relatedId: 0
    });
    
    this.createTask({
      title: 'Call Naveen Kumar to discuss requirements',
      description: 'Schedule a demo for InsightSync Basic',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      status: 'pending',
      priority: 'medium',
      assignedTo: 3, // Priya
      relatedTo: 'customer',
      relatedId: 4 // Naveen
    });
    
    this.createTask({
      title: 'Update product catalog with new prices',
      description: 'Apply the Q4 price adjustments to all products',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      status: 'completed',
      priority: 'low',
      assignedTo: 2, // Alisha
      relatedTo: 'product',
      relatedId: 0
    });
    
    this.createTask({
      title: 'Schedule team meeting for next sprint planning',
      description: 'Coordinate with all team leads for next week',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: 'pending',
      priority: 'low',
      assignedTo: 1, // Raj
      relatedTo: 'internal',
      relatedId: 0
    });
    
    // Create sample support tickets
    this.createTicket({
      title: 'Integration with accounting software not working',
      description: 'Unable to sync invoice data from InsightSync to our accounting system',
      customerId: 1, // TechSolutions
      assignedTo: 4, // Arjun
      priority: 'high',
      status: 'open',
      category: 'Integration'
    });
    
    this.createTicket({
      title: 'Need additional user licenses',
      description: 'We need to add 5 more users to our account',
      customerId: 2, // GlobalTrade
      assignedTo: 1, // Raj
      priority: 'medium',
      status: 'in-progress',
      category: 'Billing'
    });
    
    this.createTicket({
      title: 'Data import errors',
      description: 'Getting validation errors when importing customer data from CSV',
      customerId: 3, // Innovative Solutions
      assignedTo: 4, // Arjun
      priority: 'medium',
      status: 'open',
      category: 'Data Import'
    });
    
    // Create sample activities
    this.createActivity({
      userId: 2, // Alisha
      activityType: 'deal_closed',
      relatedTo: 'deal',
      relatedId: 1, // TechSolutions deal
      description: 'Closed a deal with TechSolutions Ltd. worth ₹2.4L',
      metadata: { dealId: 1, value: 240000 }
    });
    
    this.createActivity({
      userId: 1, // Raj
      activityType: 'proposal_created',
      relatedTo: 'deal',
      relatedId: 2, // GlobalTrade deal
      description: 'Created a new proposal for GlobalTrade Inc.',
      metadata: { dealId: 2 }
    });
    
    this.createActivity({
      userId: 3, // Priya
      activityType: 'lead_added',
      relatedTo: 'customer',
      relatedId: 4, // Naveen
      description: 'Added Naveen Kumar as a new lead',
      metadata: { customerId: 4 }
    });
    
    this.createActivity({
      userId: 4, // Arjun
      activityType: 'demo_scheduled',
      relatedTo: 'customer',
      relatedId: 4, // Naveen
      description: 'Scheduled a demo with InnovateTech Solutions',
      metadata: { customerId: 4, demoDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
    });
    
    this.createActivity({
      userId: 0, // System
      activityType: 'system_update',
      relatedTo: 'system',
      relatedId: 0,
      description: 'Updated the sales forecast for Q3',
      metadata: { updateType: 'forecast' }
    });
  }
}

export const storage = new MemStorage();

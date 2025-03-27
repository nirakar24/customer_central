import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertProductSchema, insertDealSchema, insertTaskSchema, insertTicketSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiPrefix = '/api';

  // Customers API
  app.get(`${apiPrefix}/customers`, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  });

  app.get(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomer(id);
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch customer' });
    }
  });

  app.post(`${apiPrefix}/customers`, async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      
      // Create activity for new customer
      await storage.createActivity({
        userId: 1, // Assuming admin user
        activityType: req.body.status === 'lead' ? 'lead_added' : 'customer_added',
        relatedTo: 'customer',
        relatedId: customer.id,
        description: `Added ${customer.name} as a new ${req.body.status === 'lead' ? 'lead' : 'customer'}`,
        metadata: { customerId: customer.id }
      });
      
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid customer data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create customer' });
    }
  });

  app.put(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(id, validatedData);
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      // Create activity for updated customer
      await storage.createActivity({
        userId: 1, // Assuming admin user
        activityType: 'customer_updated',
        relatedTo: 'customer',
        relatedId: customer.id,
        description: `Updated ${customer.name}'s information`,
        metadata: { customerId: customer.id }
      });
      
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid customer data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update customer' });
    }
  });

  app.delete(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomer(id);
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      const deleted = await storage.deleteCustomer(id);
      
      if (deleted) {
        // Create activity for deleted customer
        await storage.createActivity({
          userId: 1, // Assuming admin user
          activityType: 'customer_deleted',
          relatedTo: 'customer',
          relatedId: id,
          description: `Deleted customer ${customer.name}`,
          metadata: { customerId: id }
        });
        
        res.status(204).end();
      } else {
        res.status(500).json({ message: 'Failed to delete customer' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete customer' });
    }
  });

  // Products API
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  app.post(`${apiPrefix}/products`, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      
      // Create activity for new product
      await storage.createActivity({
        userId: 1, // Assuming admin user
        activityType: 'product_added',
        relatedTo: 'product',
        relatedId: product.id,
        description: `Added new product: ${product.name}`,
        metadata: { productId: product.id }
      });
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create product' });
    }
  });

  app.put(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Create activity for updated product
      await storage.createActivity({
        userId: 1, // Assuming admin user
        activityType: 'product_updated',
        relatedTo: 'product',
        relatedId: product.id,
        description: `Updated product: ${product.name}`,
        metadata: { productId: product.id }
      });
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update product' });
    }
  });

  app.delete(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const deleted = await storage.deleteProduct(id);
      
      if (deleted) {
        // Create activity for deleted product
        await storage.createActivity({
          userId: 1, // Assuming admin user
          activityType: 'product_deleted',
          relatedTo: 'product',
          relatedId: id,
          description: `Deleted product: ${product.name}`,
          metadata: { productId: id }
        });
        
        res.status(204).end();
      } else {
        res.status(500).json({ message: 'Failed to delete product' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete product' });
    }
  });

  // Pipeline Stages API
  app.get(`${apiPrefix}/pipeline-stages`, async (req, res) => {
    try {
      const stages = await storage.getPipelineStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pipeline stages' });
    }
  });

  // Deals API
  app.get(`${apiPrefix}/deals`, async (req, res) => {
    try {
      const { stageId, customerId } = req.query;
      let deals;
      
      if (stageId) {
        deals = await storage.getDealsByStage(parseInt(stageId as string));
      } else if (customerId) {
        deals = await storage.getDealsByCustomer(parseInt(customerId as string));
      } else {
        deals = await storage.getDeals();
      }
      
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch deals' });
    }
  });

  app.get(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDeal(id);
      
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch deal' });
    }
  });

  app.post(`${apiPrefix}/deals`, async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      
      // Create activity for new deal
      await storage.createActivity({
        userId: deal.ownerId || 1,
        activityType: 'deal_created',
        relatedTo: 'deal',
        relatedId: deal.id,
        description: `Created new deal: ${deal.title}`,
        metadata: { dealId: deal.id, value: deal.value }
      });
      
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid deal data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create deal' });
    }
  });

  app.put(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDealSchema.partial().parse(req.body);
      
      // Get the deal before update to track stage changes
      const oldDeal = await storage.getDeal(id);
      if (!oldDeal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      
      const deal = await storage.updateDeal(id, validatedData);
      
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      
      // Create activity based on what changed
      let activityType = 'deal_updated';
      let description = `Updated deal: ${deal.title}`;
      
      // Check if stage changed
      if (validatedData.stageId && oldDeal.stageId !== validatedData.stageId) {
        const newStage = await storage.getPipelineStage(validatedData.stageId);
        if (newStage) {
          activityType = 'deal_stage_changed';
          description = `Moved deal ${deal.title} to ${newStage.name} stage`;
        }
      }
      
      // Check if deal was closed
      if (validatedData.status && oldDeal.status !== 'won' && validatedData.status === 'won') {
        activityType = 'deal_closed';
        description = `Closed a deal with ${(await storage.getCustomer(deal.customerId))?.name || 'Customer'} worth ₹${(deal.value / 100000).toFixed(1)}L`;
      }
      
      await storage.createActivity({
        userId: deal.ownerId || 1,
        activityType,
        relatedTo: 'deal',
        relatedId: deal.id,
        description,
        metadata: { dealId: deal.id, value: deal.value }
      });
      
      res.json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid deal data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update deal' });
    }
  });

  app.delete(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDeal(id);
      
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      
      const deleted = await storage.deleteDeal(id);
      
      if (deleted) {
        // Create activity for deleted deal
        await storage.createActivity({
          userId: deal.ownerId || 1,
          activityType: 'deal_deleted',
          relatedTo: 'deal',
          relatedId: id,
          description: `Deleted deal: ${deal.title}`,
          metadata: { dealId: id }
        });
        
        res.status(204).end();
      } else {
        res.status(500).json({ message: 'Failed to delete deal' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete deal' });
    }
  });

  // Tasks API
  app.get(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const { assignedTo } = req.query;
      let tasks;
      
      if (assignedTo) {
        tasks = await storage.getTasksByAssignee(parseInt(assignedTo as string));
      } else {
        tasks = await storage.getTasks();
      }
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  });

  app.get(`${apiPrefix}/tasks/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch task' });
    }
  });

  app.post(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      
      // Create activity for new task
      await storage.createActivity({
        userId: task.assignedTo || 1,
        activityType: 'task_created',
        relatedTo: 'task',
        relatedId: task.id,
        description: `Created new task: ${task.title}`,
        metadata: { taskId: task.id }
      });
      
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create task' });
    }
  });

  app.put(`${apiPrefix}/tasks/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTaskSchema.partial().parse(req.body);
      
      // Get the task before update to track status changes
      const oldTask = await storage.getTask(id);
      if (!oldTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const task = await storage.updateTask(id, validatedData);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Create activity based on what changed
      let activityType = 'task_updated';
      let description = `Updated task: ${task.title}`;
      
      // Check if task was completed
      if (validatedData.status && oldTask.status !== 'completed' && validatedData.status === 'completed') {
        activityType = 'task_completed';
        description = `Completed task: ${task.title}`;
      }
      
      await storage.createActivity({
        userId: task.assignedTo || 1,
        activityType,
        relatedTo: 'task',
        relatedId: task.id,
        description,
        metadata: { taskId: task.id }
      });
      
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update task' });
    }
  });

  app.delete(`${apiPrefix}/tasks/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const deleted = await storage.deleteTask(id);
      
      if (deleted) {
        // Create activity for deleted task
        await storage.createActivity({
          userId: task.assignedTo || 1,
          activityType: 'task_deleted',
          relatedTo: 'task',
          relatedId: id,
          description: `Deleted task: ${task.title}`,
          metadata: { taskId: id }
        });
        
        res.status(204).end();
      } else {
        res.status(500).json({ message: 'Failed to delete task' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  });

  // Tickets API
  app.get(`${apiPrefix}/tickets`, async (req, res) => {
    try {
      const { customerId, assignedTo } = req.query;
      let tickets;
      
      if (customerId) {
        tickets = await storage.getTicketsByCustomer(parseInt(customerId as string));
      } else if (assignedTo) {
        tickets = await storage.getTicketsByAssignee(parseInt(assignedTo as string));
      } else {
        tickets = await storage.getTickets();
      }
      
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tickets' });
    }
  });

  app.get(`${apiPrefix}/tickets/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch ticket' });
    }
  });

  app.post(`${apiPrefix}/tickets`, async (req, res) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validatedData);
      
      // Create activity for new ticket
      await storage.createActivity({
        userId: ticket.assignedTo || 1,
        activityType: 'ticket_created',
        relatedTo: 'ticket',
        relatedId: ticket.id,
        description: `Created new support ticket: ${ticket.title}`,
        metadata: { ticketId: ticket.id }
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ticket data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create ticket' });
    }
  });

  app.put(`${apiPrefix}/tickets/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTicketSchema.partial().parse(req.body);
      
      // Get the ticket before update to track status changes
      const oldTicket = await storage.getTicket(id);
      if (!oldTicket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      const ticket = await storage.updateTicket(id, validatedData);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      // Create activity based on what changed
      let activityType = 'ticket_updated';
      let description = `Updated ticket: ${ticket.title}`;
      
      // Check if status changed
      if (validatedData.status && oldTicket.status !== validatedData.status) {
        if (validatedData.status === 'closed') {
          activityType = 'ticket_closed';
          description = `Closed ticket: ${ticket.title}`;
        } else {
          activityType = 'ticket_status_changed';
          description = `Changed ticket status to ${validatedData.status}: ${ticket.title}`;
        }
      }
      
      // Check if assignee changed
      if (validatedData.assignedTo && oldTicket.assignedTo !== validatedData.assignedTo) {
        const assignee = await storage.getUser(validatedData.assignedTo);
        if (assignee) {
          activityType = 'ticket_assigned';
          description = `Assigned ticket to ${assignee.fullName || assignee.username}: ${ticket.title}`;
        }
      }
      
      await storage.createActivity({
        userId: ticket.assignedTo || 1,
        activityType,
        relatedTo: 'ticket',
        relatedId: ticket.id,
        description,
        metadata: { ticketId: ticket.id }
      });
      
      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ticket data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update ticket' });
    }
  });

  app.delete(`${apiPrefix}/tickets/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      const deleted = await storage.deleteTicket(id);
      
      if (deleted) {
        // Create activity for deleted ticket
        await storage.createActivity({
          userId: ticket.assignedTo || 1,
          activityType: 'ticket_deleted',
          relatedTo: 'ticket',
          relatedId: id,
          description: `Deleted ticket: ${ticket.title}`,
          metadata: { ticketId: id }
        });
        
        res.status(204).end();
      } else {
        res.status(500).json({ message: 'Failed to delete ticket' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete ticket' });
    }
  });

  // Activities API
  app.get(`${apiPrefix}/activities`, async (req, res) => {
    try {
      const { relatedTo, relatedId } = req.query;
      let activities;
      
      if (relatedTo && relatedId) {
        activities = await storage.getActivitiesByRelated(
          relatedTo as string, 
          parseInt(relatedId as string)
        );
      } else {
        activities = await storage.getActivities();
      }
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch activities' });
    }
  });

  app.post(`${apiPrefix}/activities`, async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid activity data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create activity' });
    }
  });

  // Users API
  app.get(`${apiPrefix}/users`, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get(`${apiPrefix}/users/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Dashboard stats API
  app.get(`${apiPrefix}/dashboard/stats`, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      const deals = await storage.getDeals();
      const pipelineStages = await storage.getPipelineStages();
      const tickets = await storage.getTickets();
      
      // Calculate total revenue (sum of all won deals)
      const totalRevenue = deals
        .filter(deal => deal.status === 'won')
        .reduce((sum, deal) => sum + deal.value, 0);
      
      // Count new customers in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newCustomers = customers.filter(customer => 
        new Date(customer.createdAt) > thirtyDaysAgo
      ).length;
      
      // Calculate churn rate (placeholder calculation)
      const churnRate = 3.2; // This would normally be calculated from actual data
      
      // Calculate average deal size
      const closedDeals = deals.filter(deal => deal.status === 'won');
      const avgDealSize = closedDeals.length > 0 
        ? closedDeals.reduce((sum, deal) => sum + deal.value, 0) / closedDeals.length 
        : 0;
      
      // Create pipeline summary
      const pipelineSummary = pipelineStages.map(stage => {
        const stageDeals = deals.filter(deal => deal.stageId === stage.id);
        const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
        return {
          ...stage,
          count: stageDeals.length,
          value: totalValue
        };
      });
      
      // Team performance (simplified)
      const users = await storage.getUsers();
      const teamPerformance = users.map(user => {
        const userDeals = deals.filter(deal => deal.ownerId === user.id && deal.status === 'won');
        const totalValue = userDeals.reduce((sum, deal) => sum + deal.value, 0);
        const percentageOfTarget = Math.min(85, Math.max(45, Math.floor(Math.random() * 40) + 45)); // Dummy value between 45-85%
        return {
          id: user.id,
          name: user.fullName || user.username,
          avatarUrl: user.avatarUrl,
          value: totalValue,
          percentageOfTarget,
          growth: (Math.random() * 20 - 5).toFixed(1) // Random growth between -5% and 15%
        };
      });
      
      // Recent activities
      const activities = (await storage.getActivities()).slice(0, 5);
      
      // Today's tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todaysTasks = (await storage.getTasks())
        .filter(task => {
          const taskDate = task.dueDate ? new Date(task.dueDate) : null;
          return taskDate && taskDate >= today && taskDate < tomorrow;
        })
        .slice(0, 5);
      
      res.json({
        metrics: {
          totalRevenue,
          newCustomers,
          churnRate,
          avgDealSize
        },
        pipelineSummary,
        teamPerformance,
        recentActivities: activities,
        todaysTasks
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

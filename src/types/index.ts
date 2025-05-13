export interface DeliveryPartner{
    _id?:string;
    name:string;
    email:string;
    phone:string;
    status:"active"|"inactive",
    currentLoad:number;
    areas:string[];
    shift:{
        start:string;
        end:string;
    };
    metrics:{
        rating:number,
        completedOrders:number;
        cancelledOrders:number;
    };
}

export interface Order{
    _id:string;
    orderNumber:string;
    customer:{
        name:string;
        phone:string;
        address:string;
    };
    area:string;
    items:{
        name:string;
        quantity:number,
        price:number;
    }[];
    status:"pending"|"assigned"|"picked"|"delivered";
    scheduledFor:string;
    assignedTo?:string;
    totalAmount:number;
    createdAt:string;
    updatedAt:string;
}

export interface Assignment{
    orderId:string;
    partnerId:string;
    timestamp:string;
    status:"success"|"failed";
    reason?:string;
}

export interface AssignmentMetrics{
    totalAssigned:number;
    successRate:number;
    averageTime:number;
    failureReasons:{
        reason:string;
        count:number;
    }[];
}
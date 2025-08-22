"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, CreditCard, Download, Calendar, Users, Database, Zap } from "lucide-react"

export default function BillingPage() {
  const [currentPlan] = useState("pro") // Mock current plan

  // Mock data
  const planInfo = {
    name: "Pro Plan",
    price: "$29",
    period: "month",
    nextBilling: "December 15, 2024",
    status: "active",
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for getting started",
      features: ["Up to 3 projects", "Basic form submissions", "Community support", "5GB storage"],
      maxProjects: 3,
      maxUsers: 1,
      storage: "5GB",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "month",
      description: "Best for growing businesses",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "100GB storage",
        "Custom domains",
        "Team collaboration",
      ],
      maxProjects: "Unlimited",
      maxUsers: 10,
      storage: "100GB",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Advanced security",
        "Dedicated support",
        "1TB storage",
        "SSO integration",
        "Custom integrations",
      ],
      maxProjects: "Unlimited",
      maxUsers: "Unlimited",
      storage: "1TB",
    },
  ]

  const billingHistory = [
    {
      id: "inv_001",
      date: "Nov 15, 2024",
      description: "Pro Plan - Monthly",
      amount: "$29.00",
      status: "paid",
    },
    {
      id: "inv_002",
      date: "Oct 15, 2024",
      description: "Pro Plan - Monthly",
      amount: "$29.00",
      status: "paid",
    },
    {
      id: "inv_003",
      date: "Sep 15, 2024",
      description: "Pro Plan - Monthly",
      amount: "$29.00",
      status: "paid",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge variant={planInfo.status === "active" ? "default" : "secondary"}>{planInfo.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{planInfo.name}</h3>
              <p className="text-gray-600">
                {planInfo.price}/{planInfo.period}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Next billing date</p>
              <p className="font-medium">{planInfo.nextBilling}</p>
            </div>
          </div>
          <Separator />
          <div className="flex space-x-2">
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Update Payment Method
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Change Billing Cycle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border p-6 ${
                  plan.popular ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Database className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{plan.storage} storage</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Zap className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{plan.maxProjects} projects</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{plan.maxUsers} team members</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-6 w-full"
                  variant={currentPlan === plan.id ? "secondary" : "default"}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

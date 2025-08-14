import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Database, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const TransactionList = ({ 
  transactions = [], 
  products = [],
  onView, 
  showActions = true,
  title = "Blockchain Transactions",
  description = "Monitor all blockchain transactions"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter transactions based on search term, type, and status
  const filteredTransactions = transactions.filter(transaction => {
    const product = products.find(p => p.id === transaction.productId);
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.blockHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get unique types and statuses
  const types = ['all', ...new Set(transactions.map(tx => tx.type))];
  const statuses = ['all', ...new Set(transactions.map(tx => tx.status))];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pending', 
          variant: 'secondary',
          icon: Clock,
          color: 'text-yellow-600'
        };
      case 'confirmed':
        return { 
          label: 'Confirmed', 
          variant: 'default',
          icon: CheckCircle,
          color: 'text-green-600'
        };
      case 'failed':
        return { 
          label: 'Failed', 
          variant: 'destructive',
          icon: AlertCircle,
          color: 'text-red-600'
        };
      default:
        return { 
          label: status, 
          variant: 'outline',
          icon: Clock,
          color: 'text-gray-600'
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'sale':
        return { 
          label: 'Sale', 
          variant: 'default',
          icon: ArrowUpRight,
          color: 'text-green-600'
        };
      case 'purchase':
        return { 
          label: 'Purchase', 
          variant: 'secondary',
          icon: ArrowDownLeft,
          color: 'text-blue-600'
        };
      case 'transfer':
        return { 
          label: 'Transfer', 
          variant: 'outline',
          icon: ArrowUpRight,
          color: 'text-purple-600'
        };
      default:
        return { 
          label: type, 
          variant: 'outline',
          icon: ArrowUpRight,
          color: 'text-gray-600'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Block Hash</TableHead>
                  {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const product = products.find(p => p.id === transaction.productId);
                  const statusConfig = getStatusConfig(transaction.status);
                  const typeConfig = getTypeConfig(transaction.type);
                  const StatusIcon = statusConfig.icon;
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(transaction.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                          <Badge variant={typeConfig.variant}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(transaction.from)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(transaction.to)}
                      </TableCell>
                      <TableCell>
                        {product ? (
                          <div className="flex items-center space-x-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-gray-500">Qty: {transaction.quantity}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${transaction.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(transaction.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(transaction.blockHash)}
                      </TableCell>
                      {showActions && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onView && (
                                <DropdownMenuItem onClick={() => onView(transaction)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => copyToClipboard(transaction.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Transaction ID
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(transaction.blockHash)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Block Hash
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Blockchain transactions will appear here as they occur.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;


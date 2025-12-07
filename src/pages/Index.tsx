import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
  icon: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'expense', amount: 2500, category: 'Продукты', description: 'Супермаркет', date: '2025-12-05' },
    { id: '2', type: 'income', amount: 75000, category: 'Зарплата', description: 'Основная работа', date: '2025-12-01' },
    { id: '3', type: 'expense', amount: 1200, category: 'Транспорт', description: 'Такси', date: '2025-12-04' },
    { id: '4', type: 'expense', amount: 3500, category: 'Развлечения', description: 'Кино и ресторан', date: '2025-12-03' },
    { id: '5', type: 'expense', amount: 15000, category: 'Жилье', description: 'Коммунальные услуги', date: '2025-12-02' },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Продукты', limit: 20000, spent: 12500, icon: 'ShoppingCart' },
    { category: 'Транспорт', limit: 5000, spent: 3200, icon: 'Car' },
    { category: 'Развлечения', limit: 10000, spent: 7500, icon: 'Film' },
    { category: 'Жилье', limit: 25000, spent: 15000, icon: 'Home' },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
  });

  const categories = {
    expense: ['Продукты', 'Транспорт', 'Развлечения', 'Жилье', 'Здоровье', 'Образование', 'Другое'],
    income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарки', 'Другое'],
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([transaction, ...transactions]);

    if (transaction.type === 'expense') {
      setBudgets(budgets.map(b => 
        b.category === transaction.category 
          ? { ...b, spent: b.spent + transaction.amount }
          : b
      ));
    }

    setNewTransaction({ type: 'expense', amount: '', category: '', description: '' });
    
    toast({
      title: 'Успешно',
      description: 'Транзакция добавлена',
    });
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'Продукты': 'ShoppingCart',
      'Транспорт': 'Car',
      'Развлечения': 'Film',
      'Жилье': 'Home',
      'Здоровье': 'Heart',
      'Образование': 'BookOpen',
      'Зарплата': 'Briefcase',
      'Фриланс': 'Code',
      'Инвестиции': 'TrendingUp',
      'Подарки': 'Gift',
    };
    return iconMap[category] || 'Wallet';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Icon name="Wallet" className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ФинансТрекер</h1>
                <p className="text-sm text-muted-foreground">Контролируйте свои финансы</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Plus" className="h-4 w-4" />
                  Добавить транзакцию
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новая транзакция</DialogTitle>
                  <DialogDescription>Добавьте доход или расход</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Тип</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value: 'income' | 'expense') =>
                        setNewTransaction({ ...newTransaction, type: value, category: '' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Доход</SelectItem>
                        <SelectItem value="expense">Расход</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Сумма</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[newTransaction.type].map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Описание (опционально)</Label>
                    <Input
                      placeholder="Описание транзакции"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddTransaction} className="w-full">
                    Добавить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Баланс</CardTitle>
              <Icon name="Wallet" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{balance.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">Общий баланс</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Доходы</CardTitle>
              <Icon name="TrendingUp" className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalIncome.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Расходы</CardTitle>
              <Icon name="TrendingDown" className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Транзакции</TabsTrigger>
            <TabsTrigger value="budget">Бюджет</TabsTrigger>
            <TabsTrigger value="reports">Отчеты</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>Ваши последние операции</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Icon
                            name={getCategoryIcon(transaction.category)}
                            className={`h-6 w-6 ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.category}</div>
                          <div className="text-sm text-muted-foreground">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                            })}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {transaction.amount.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление бюджетом</CardTitle>
                <CardDescription>Следите за расходами по категориям</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgets.map((budget) => {
                    const percentage = (budget.spent / budget.limit) * 100;
                    return (
                      <div key={budget.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon name={budget.icon} className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{budget.category}</div>
                              <div className="text-sm text-muted-foreground">
                                {budget.spent.toLocaleString('ru-RU')} ₽ из {budget.limit.toLocaleString('ru-RU')} ₽
                              </div>
                            </div>
                          </div>
                          <Badge variant={percentage > 90 ? 'destructive' : percentage > 70 ? 'secondary' : 'default'}>
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Расходы по категориям</CardTitle>
                  <CardDescription>Декабрь 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.map((budget) => {
                      const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
                      const percentage = (budget.spent / totalSpent) * 100;
                      return (
                        <div key={budget.category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{budget.category}</span>
                            <span className="text-sm text-muted-foreground">
                              {budget.spent.toLocaleString('ru-RU')} ₽ ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                  <CardDescription>Ключевые показатели</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium">Средний расход в день</span>
                    <span className="font-bold">{(totalExpense / 7).toFixed(0)} ₽</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium">Самая затратная категория</span>
                    <span className="font-bold">
                      {budgets.reduce((max, b) => b.spent > max.spent ? b : max).category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium">Экономия к бюджету</span>
                    <span className="font-bold text-green-600">
                      {(budgets.reduce((sum, b) => sum + b.limit, 0) - totalExpense).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium">Всего транзакций</span>
                    <span className="font-bold">{transactions.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Профиль пользователя</CardTitle>
                <CardDescription>Управление настройками</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Иван Петров</h3>
                    <p className="text-sm text-muted-foreground">ivan.petrov@example.com</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Icon name="Download" className="h-4 w-4" />
                    Экспорт данных
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Icon name="Upload" className="h-4 w-4" />
                    Импорт из банка
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Icon name="Settings" className="h-4 w-4" />
                    Настройки
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Icon name="Bell" className="h-4 w-4" />
                    Уведомления
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

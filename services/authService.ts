import { User, Transaction, GlobalStats } from "../types";
import { apiRequest } from "./apiConfig";

// Helper to convert Django user to frontend User format
function convertDjangoUser(djangoUser: any): User {
  return {
    id: djangoUser.id.toString(),
    email: djangoUser.email,
    name: djangoUser.name || `${djangoUser.first_name} ${djangoUser.last_name}`.trim() || djangoUser.username,
    balance: parseFloat(djangoUser.balance),
    totalRecycledKg: parseFloat(djangoUser.total_recycled_kg),
    level: djangoUser.level,
    joinDate: djangoUser.join_date,
    role: djangoUser.role || 'user',
    region: djangoUser.region || undefined,
    district: djangoUser.district || undefined,
  };
}

// Helper to convert Django transaction to frontend Transaction format
function convertDjangoTransaction(djangoTx: any): Transaction {
  return {
    id: djangoTx.id.toString(),
    date: djangoTx.date,
    amount: parseFloat(djangoTx.amount),
    type: djangoTx.type,
    description: djangoTx.description,
    provider: djangoTx.provider || undefined
  };
}

// Store current user in localStorage for quick access
const CURRENT_USER_KEY = 'ecocash_current_user';

export const AuthService = {
  // Send verification code to email
  sendVerificationCode: async (firstName: string, lastName: string, email: string): Promise<{message: string, code?: string, email: string, delivery_time?: string}> => {
    try {
      const response = await apiRequest('/users/send_verification_code/', {
        method: 'POST',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Send verification code error:', error);
      throw new Error(error.message || 'Kod yuborishda xatolik yuz berdi');
    }
  },

  // Verify code and register user
  verifyCode: async (firstName: string, lastName: string, email: string, password: string, code: string): Promise<User> => {
    try {
      const response = await apiRequest('/users/verify_code/', {
        method: 'POST',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          code: code,
        }),
      });

      const djangoUser = await response.json();
      const user = convertDjangoUser(djangoUser);
      
      // Save to localStorage for quick access
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      // Save credentials for auto-login
      localStorage.setItem('ecocash_credentials', JSON.stringify({
        email: email,
        password: password
      }));
      
      return user;
    } catch (error: any) {
      console.error('Verify code error:', error);
      throw new Error(error.message || 'Kod tasdiqlashda xatolik yuz berdi');
    }
  },

  // Register new user - ism, familya, username, email va parol
  register: async (username: string, password: string, first_name?: string, last_name?: string, email?: string, region?: string, district?: string): Promise<User> => {
    try {
      const requestBody: any = {
        username: username.trim(),
        password: password,
        password_confirm: password,
        first_name: (first_name || username).trim(),
        last_name: (last_name || '').trim(),
      };

      // Email qo'shish (agar berilgan bo'lsa)
      if (email && email.trim()) {
        requestBody.email = email.trim().toLowerCase();
      }

      // Viloyat va tuman qo'shish (agar berilgan bo'lsa)
      if (region && region.trim()) {
        requestBody.region = region.trim();
      }
      if (district && district.trim()) {
        requestBody.district = district.trim();
      }
      
      // Email'ni umuman yubormaslik (backend avtomatik yaratadi)
      // Agar email yuborilmasa, serializer None qabul qiladi
      
      const response = await apiRequest('/users/register/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const djangoUser = await response.json();
      const user = convertDjangoUser(djangoUser);
      
      // Save to localStorage for quick access
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Xatolikni yaxshiroq qaytarish
      let errorMessage = 'Registration failed';
      
      try {
        // Agar response mavjud bo'lsa, JSON'ni o'qish
        if (error.response) {
          const errorData = await error.response.json().catch(() => ({}));
          if (errorData.username) {
            errorMessage = `Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}`;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        errorMessage = error.message || 'Registration failed';
      }
      
      throw new Error(errorMessage);
    }
  },

  // Login with username/email and password
  login: async (usernameOrEmail: string, password: string): Promise<User> => {
    try {
      // Validate inputs
      if (!usernameOrEmail || !usernameOrEmail.trim()) {
        throw new Error('Username yoki Email kiriting');
      }
      if (!password || !password.trim()) {
        throw new Error('Parol kiriting');
      }

      const response = await apiRequest('/users/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: usernameOrEmail.trim(), // Backend username yoki email bilan ishlaydi
          password: password,
        }),
      });

      const djangoUser = await response.json();
      
      // Check if response is valid
      if (!djangoUser || !djangoUser.id) {
        throw new Error('Server javob bermadi');
      }
      
      const user = convertDjangoUser(djangoUser);
      
      // Save to localStorage for quick access
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Better error messages
      let errorMessage = error.message || 'Kirishda xatolik yuz berdi';
      
      // Handle specific error cases
      if (errorMessage.includes('Foydalanuvchi topilmadi')) {
        errorMessage = 'Username yoki Email noto\'g\'ri';
      } else if (errorMessage.includes('Noto\'g\'ri parol')) {
        errorMessage = 'Parol noto\'g\'ri';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('ulanishda muammo')) {
        errorMessage = 'Serverga ulanishda muammo. Iltimos, backend serverni tekshiring.';
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Username/Email yoki parol noto\'g\'ri';
      }
      
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await apiRequest('/users/logout/', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('ecocash_credentials');
    }
  },

  deleteAccount: async (userId: string): Promise<void> => {
    try {
      const meResponse = await apiRequest('/users/me/');
      const currentUser = await meResponse.json();
      
      await apiRequest(`/users/${currentUser.id}/delete_account/`, {
        method: 'POST',
      });
      
      // Clear all stored data
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('ecocash_credentials');
    } catch (error: any) {
      console.error('Delete account error:', error);
      throw new Error(error.message || 'Hisobni o\'chirishda xatolik yuz berdi');
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Try to get from API first
      const response = await apiRequest('/users/me/');
      const djangoUser = await response.json();
      const user = convertDjangoUser(djangoUser);
      
      // Update localStorage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  // Update user stats after recycling
  updateStats: async (userId: string, addedBalance: number, addedKg: number): Promise<User> => {
    try {
      // To'g'ridan-to'g'ri userId ishlatish — /me/ ga murojaat qilmaslik (403 beradi)
      const response = await apiRequest(`/users/${userId}/update_stats/`, {
        method: 'POST',
        body: JSON.stringify({
          added_balance: addedBalance,
          added_kg: addedKg,
        }),
      });

      const djangoUser = await response.json();
      const user = convertDjangoUser(djangoUser);

      // Update localStorage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return user;
    } catch (error: any) {
      console.error('Update stats error:', error);
      throw new Error(error.message || 'Failed to update stats');
    }
  },

  getGlobalStats: async (): Promise<GlobalStats> => {
    try {
      const response = await apiRequest('/stats/');
      const data = await response.json();
      
      // Handle array response (Django returns array)
      const stats = Array.isArray(data) ? data[0] : data;
      
      return {
        totalUsers: stats.total_users || 142050,
        totalWasteCollected: parseFloat(stats.total_waste_collected || 5890),
        totalPayouts: parseInt(stats.total_payouts || 850000000),
        co2Saved: parseFloat(stats.co2_saved || 2100),
      };
    } catch (error) {
      console.error('Get global stats error:', error);
      // Return default stats on error
      return {
        totalUsers: 142050,
        totalWasteCollected: 5890,
        totalPayouts: 850000000,
        co2Saved: 2100,
      };
    }
  },

  payUtility: async (userId: string, provider: string, accountNumber: string, amount: number): Promise<{user: User, success: boolean, message?: string}> => {
    try {
      // First try to get current user from API (for authentication)
      let currentUserId: string | null = null;
      
      try {
        const meResponse = await apiRequest('/users/me/');
        const currentUser = await meResponse.json();
        if (currentUser && currentUser.id) {
          currentUserId = currentUser.id.toString();
          console.log('✅ Using authenticated user ID:', currentUserId);
        }
      } catch (meError: any) {
        console.warn('⚠️ Could not get user from /me/ endpoint:', meError);
        
        // Fallback: try localStorage
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.id) {
              const idNum = parseInt(parsedUser.id);
              if (!isNaN(idNum) && idNum < 1000000 && idNum > 0) {
                currentUserId = parsedUser.id.toString();
                console.log('⚠️ Using user ID from localStorage (fallback):', currentUserId);
              }
            }
          } catch (e) {
            console.warn('Failed to parse localStorage user:', e);
          }
        }
        
        // Last resort: use provided userId if it looks valid
        if (!currentUserId && userId) {
          const idNum = parseInt(userId);
          if (!isNaN(idNum) && idNum < 1000000 && idNum > 0) {
            currentUserId = userId.toString();
            console.log('⚠️ Using provided userId (last resort):', currentUserId);
          }
        }
      }
      
      if (!currentUserId) {
        throw new Error('Foydalanuvchi topilmadi. Iltimos, qaytadan kirib ko\'ring.');
      }
      
      try {
        const response = await apiRequest(`/users/${currentUserId}/pay_utility/`, {
          method: 'POST',
          body: JSON.stringify({
            provider: provider,
            account_number: accountNumber,
            amount: amount,
          }),
        });

        const responseData = await response.json();
        
        console.log('📦 Backend response:', responseData);
        
        // Check if payment was successful
        if (responseData.success === false || responseData.error) {
          const errorMsg = responseData.error || 'To\'lov amalga oshirilmadi';
          console.error('❌ To\'lov muvaffaqiyatsiz:', errorMsg);
          throw new Error(errorMsg);
        }
        
        // If success is not explicitly false and no error, assume success
        const user = convertDjangoUser(responseData);
        
        // Update localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        
        const successMessage = responseData.message || 'To\'lov muvaffaqiyatli amalga oshirildi!';
        console.log('✅ To\'lov muvaffaqiyatli:', successMessage);
        
        return {
          user,
          success: true,
          message: successMessage
        };
      } catch (apiError: any) {
        // If apiRequest throws, it means the response was not ok
        // Try to extract error message
        if (apiError.message) {
          throw apiError;
        }
        throw new Error("To'lov amalga oshirilmadi!");
      }
    } catch (error: any) {
      console.error('Pay utility error:', error);
      throw error;
    }
  },
  
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await apiRequest('/transactions/');
      const data = await response.json();
      
      // Handle paginated response
      const transactions = data.results || data;
      
      return transactions.map((tx: any) => convertDjangoTransaction(tx));
    } catch (error) {
      console.error('Get transactions error:', error);
      return [];
    }
  },

  // Check if email exists
  checkEmail: async (email: string): Promise<{exists: boolean, message: string}> => {
    try {
      const response = await apiRequest('/users/check_email/', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Check email error:', error);
      throw new Error(error.message || 'Email tekshirishda xatolik');
    }
  },

};

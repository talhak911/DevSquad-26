/**
 * Contract ABI and address configuration.
 *
 * After deploying the updated TodoList.sol on Kasplex Testnet via Remix IDE,
 * replace CONTRACT_ADDRESS below with the new deployed address.
 *
 * KEY CHANGE: All view/read functions now accept an explicit `owner` address
 * parameter instead of using msg.sender. This fixes silent empty-array reads
 * on RPCs that do not propagate `from` into the eth_call EVM context.
 */
// 0xC18834E0Aeb42d9fe21F0640FcDDf8b68a539Ff3

export const CONTRACT_ADDRESS = '0x5EF131e72214F37B513cb00224fb60c1B9720FdC' as `0x${string}`

export const TODO_ABI = [
  // ─── Write functions ───────────────────────────────────────────────────
  {
    name: 'createTask',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'content',  type: 'string' },
      { name: 'priority', type: 'uint8'  },
      { name: 'category', type: 'string' },
    ],
    outputs: [{ name: 'taskId', type: 'uint256' }],
  },
  {
    name: 'toggleTask',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'taskId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'editTask',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'taskId',     type: 'uint256' },
      { name: 'newContent', type: 'string'  },
    ],
    outputs: [],
  },
  {
    name: 'updatePriority',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'taskId',      type: 'uint256' },
      { name: 'newPriority', type: 'uint8'   },
    ],
    outputs: [],
  },
  {
    name: 'deleteTask',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'taskId', type: 'uint256' }],
    outputs: [],
  },

  // ─── Read functions (all accept explicit `owner` address — no msg.sender) ──
  {
    name: 'getAllTasks',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },   // ← pass wallet address explicitly
    ],
    outputs: [
      {
        name: 'tasks',
        type: 'tuple[]',
        components: [
          { name: 'id',        type: 'uint256' },
          { name: 'content',   type: 'string'  },
          { name: 'completed', type: 'bool'    },
          { name: 'deleted',   type: 'bool'    },
          { name: 'priority',  type: 'uint8'   },
          { name: 'category',  type: 'string'  },
          { name: 'createdAt', type: 'uint256' },
          { name: 'updatedAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getTask',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner',  type: 'address' },
      { name: 'taskId', type: 'uint256' },
    ],
    outputs: [
      {
        name: 'task',
        type: 'tuple',
        components: [
          { name: 'id',        type: 'uint256' },
          { name: 'content',   type: 'string'  },
          { name: 'completed', type: 'bool'    },
          { name: 'deleted',   type: 'bool'    },
          { name: 'priority',  type: 'uint8'   },
          { name: 'category',  type: 'string'  },
          { name: 'createdAt', type: 'uint256' },
          { name: 'updatedAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getCompletedTasks',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [
      {
        name: 'tasks',
        type: 'tuple[]',
        components: [
          { name: 'id',        type: 'uint256' },
          { name: 'content',   type: 'string'  },
          { name: 'completed', type: 'bool'    },
          { name: 'deleted',   type: 'bool'    },
          { name: 'priority',  type: 'uint8'   },
          { name: 'category',  type: 'string'  },
          { name: 'createdAt', type: 'uint256' },
          { name: 'updatedAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getPendingTasks',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [
      {
        name: 'tasks',
        type: 'tuple[]',
        components: [
          { name: 'id',        type: 'uint256' },
          { name: 'content',   type: 'string'  },
          { name: 'completed', type: 'bool'    },
          { name: 'deleted',   type: 'bool'    },
          { name: 'priority',  type: 'uint8'   },
          { name: 'category',  type: 'string'  },
          { name: 'createdAt', type: 'uint256' },
          { name: 'updatedAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getTaskCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },

  // ─── Events ────────────────────────────────────────────────────────────
  {
    name: 'TaskCreated',
    type: 'event',
    inputs: [
      { name: 'owner',     type: 'address', indexed: true  },
      { name: 'taskId',    type: 'uint256', indexed: true  },
      { name: 'content',   type: 'string',  indexed: false },
      { name: 'priority',  type: 'uint8',   indexed: false },
      { name: 'category',  type: 'string',  indexed: false },
      { name: 'createdAt', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'TaskToggled',
    type: 'event',
    inputs: [
      { name: 'owner',     type: 'address', indexed: true  },
      { name: 'taskId',    type: 'uint256', indexed: true  },
      { name: 'completed', type: 'bool',    indexed: false },
      { name: 'updatedAt', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'TaskEdited',
    type: 'event',
    inputs: [
      { name: 'owner',      type: 'address', indexed: true  },
      { name: 'taskId',     type: 'uint256', indexed: true  },
      { name: 'newContent', type: 'string',  indexed: false },
      { name: 'updatedAt',  type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'TaskDeleted',
    type: 'event',
    inputs: [
      { name: 'owner',     type: 'address', indexed: true  },
      { name: 'taskId',    type: 'uint256', indexed: true  },
      { name: 'deletedAt', type: 'uint256', indexed: false },
    ],
  },
] as const

// Priority enum mapping
export const PRIORITY_LABELS: Record<number, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
}

export const PRIORITY_COLORS: Record<number, string> = {
  0: '#4ade80', // green
  1: '#facc15', // yellow
  2: '#f87171', // red
}

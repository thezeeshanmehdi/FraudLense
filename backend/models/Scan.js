import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Scan = sequelize.define('Scan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('wallet', 'contract'),
      allowNull: false
    },
    riskScore: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    riskLevel: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('details');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('details', JSON.stringify(value));
      }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    warnings: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('warnings');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('warnings', JSON.stringify(value));
      }
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('recommendations');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('recommendations', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'scans',
    timestamps: true,
    createdAt: 'timestamp', // Match MongoDB field name for frontend sync
    updatedAt: false,
    indexes: [
      {
        name: 'idx_address',
        fields: ['address']
      }
    ]
  });

  return Scan;
}

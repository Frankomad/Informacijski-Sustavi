import { riskTypeSchema, riskTypeResponseSchema } from '../RiskType.js';

describe('RiskType Schema', () => {
  const mockRiskType = {
    id: '36078920-83de-462e-8bb9-dddb4bce9e53',
    name: 'Medium-High Risk',
    description: 'Above-average risk with moderate to high potential returns',
    color: '#f97316',
    created_at: '2025-05-24 12:06:06.122298+00',
    updated_at: '2025-05-24 12:06:06.122298+00'
  };

  it('should validate a valid risk type', () => {
    const result = riskTypeSchema.safeParse({
      name: 'Medium-High Risk',
      description: 'Above-average risk with moderate to high potential returns',
      color: '#f97316'
    });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid risk type', () => {
    const result = riskTypeSchema.safeParse({
      name: '', // Empty name should fail
      description: 'Above-average risk with moderate to high potential returns',
      color: '#f97316'
    });
    expect(result.success).toBe(false);
  });

  it('should validate a complete risk type response', () => {
    const result = riskTypeResponseSchema.safeParse(mockRiskType);
    expect(result.success).toBe(true);
  });
}); 
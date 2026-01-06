
interface RadioTemplateCardProps {
    id: string;
    name: string;
    icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export function RadioTemplateCard({ id, name, icon: Icon, isSelected, onSelect }: RadioTemplateCardProps) {
    return (
        <label style={{ cursor: 'pointer' }}>
            <input
                type="radio"
                name="template"
                value={id}
                checked={isSelected}
                onChange={() => onSelect(id)}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    width: 0,
                    height: 0
                }}
            />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                minHeight: '120px',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? 'var(--primary-green)' : 'var(--gray-300)'}`,
                background: isSelected ? 'var(--primary-green-light)' : 'var(--white)',
                color: isSelected ? 'var(--primary-green)' : 'var(--gray-700)',
                boxShadow: isSelected ? '0 2px 8px rgba(19, 138, 7, 0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}>
                {isSelected && (
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--primary-green)'
                    }} />
                )}
                <Icon size={36} style={{ marginBottom: '0.75rem' }} />
                <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textAlign: 'center'
                }}>
                    {name}
                </span>
            </div>
        </label>
    );
}

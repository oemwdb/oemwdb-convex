import React from "react";

interface WheelVariantsTableProps {
    wheelName: string;
    diameter?: string | null;
    width?: string | null;
    offset?: string | null;
    boltPattern?: string | null;
    centerBore?: string | null;
    weight?: string | null;
    tireSize?: string | null;
    partNumbers?: string | null;
    vehicles?: Array<{
        chassis_code?: string;
        model_name?: string;
        vehicle_title?: string;
    }>;
}

const WheelVariantsTable: React.FC<WheelVariantsTableProps> = ({
    diameter,
    width,
    offset,
    boltPattern,
    centerBore,
    weight,
    tireSize,
    partNumbers,
    vehicles = [],
}) => {
    const specs = `${diameter || '—'} x ${width || '—'}`;
    const offsetVal = offset || '—';
    const boreVal = centerBore ? `${centerBore}mm` : '—';
    const boltVal = boltPattern || '—';
    const weightVal = weight || '—';
    const tireVal = tireSize || '—';
    const partNum = partNumbers?.split(/[,;\n]/)[0]?.trim() || '???';

    const rows = vehicles.length > 0
        ? vehicles.slice(0, 15).map(v => v.chassis_code || v.model_name || 'Universal')
        : ['Universal'];

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Model:</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Specifications:<br /><span style={{ fontSize: '11px' }}>(F/R)</span></th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Offset: ET<br /><span style={{ fontSize: '11px' }}>(F/R)</span></th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Center Bore: mm</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Bolt Pattern:</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Weight:<br /><span style={{ fontSize: '11px' }}>(F/R)</span></th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Tire Size:<br /><span style={{ fontSize: '11px' }}>(F/R)</span></th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 'normal', color: '#888' }}>Part Number:<br /><span style={{ fontSize: '11px' }}>(F/R)</span></th>
                </tr>
            </thead>
            <tbody>
                {rows.map((model, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{model}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{specs}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{offsetVal}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{boreVal}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{boltVal}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{weightVal}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{tireVal}</td>
                        <td style={{ padding: '8px 12px', color: '#ccc' }}>{partNum}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default WheelVariantsTable;

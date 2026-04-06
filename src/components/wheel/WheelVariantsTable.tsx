import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VehicleInfo {
    id?: string;
    chassis_code?: string;
    model_name?: string;
    vehicle_title?: string;
}

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
    vehicles?: VehicleInfo[];
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
    const hasTireSize = Boolean(tireSize && tireSize.trim() && tireSize.trim() !== "—");

    // Since all vehicles share the same wheel specs, group them into a single row
    // Each vehicle becomes a clickable tag
    const vehicleTags = vehicles.length > 0
        ? vehicles.slice(0, 15).map(v => ({
            label: v.chassis_code || v.model_name || v.vehicle_title || 'Unknown',
            id: v.id || null
        }))
        : [{ label: 'Universal', id: null }];

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
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {vehicleTags.map((v, idx) => (
                                v.id ? (
                                    <Link key={idx} to={`/vehicles/${encodeURIComponent(v.id)}`}>
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0.5 px-2"
                                        >
                                            {v.label}
                                        </Badge>
                                    </Link>
                                ) : (
                                    <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs py-0.5 px-2 opacity-60"
                                    >
                                        {v.label}
                                    </Badge>
                                )
                            ))}
                        </div>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>{specs}</td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>{offsetVal}</td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>{boreVal}</td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>{boltVal}</td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>{weightVal}</td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span>{tireVal}</span>
                            {hasTireSize ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 rounded-full px-3 text-[11px] font-medium"
                                    onClick={(event) => {
                                        event.preventDefault();
                                    }}
                                >
                                    Buy Tires
                                </Button>
                            ) : null}
                        </div>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#ccc' }}>{partNum}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default WheelVariantsTable;

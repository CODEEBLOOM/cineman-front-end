import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { seatLegendItems } from './seatVisualConfig';

const NoteInfo = () => {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {seatLegendItems.map((item) => (
        <li key={item.key} className="flex items-center gap-2">
          <span
            className="flex h-[18px] w-[18px] items-center justify-center rounded-md border"
            style={{
              backgroundColor: item.swatch,
              borderColor: item.swatchBorder,
            }}
          >
            {item.checked && (
              <CheckRoundedIcon
                sx={{ fontSize: 14, color: item.checkColor || '#ffffff' }}
              />
            )}
          </span>
          <span className="text-sm font-medium text-slate-700">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default NoteInfo;

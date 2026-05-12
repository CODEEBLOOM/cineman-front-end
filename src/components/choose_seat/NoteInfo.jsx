import RegularSeat from '@component/seat/RegularSeat';
import { seatLegendItems, seatStatusAppearance } from './seatVisualConfig';

const NoteInfo = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {seatLegendItems.map((item) => {
        const visual = seatStatusAppearance[item.key];

        return (
          <div
            key={item.key}
            className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div
              className="relative flex h-[46px] w-[52px] items-center justify-center rounded-[14px] border"
              style={{
                backgroundColor: visual.backgroundColor || '#f7f4ec',
                borderColor: visual.borderColor || '#e7dbc2',
              }}
            >
              <RegularSeat
                size="30px"
                color={visual.iconColor || '#b8c1cc'}
              />
            </div>
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default NoteInfo;

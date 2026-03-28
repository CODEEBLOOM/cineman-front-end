import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuCheck, LuChevronDown, LuMapPin } from 'react-icons/lu';
import {
  completeMovieTheaterSelection,
  setMovieTheater,
} from '@redux/slices/movieTheaterSlice';

const defaultMovieTheater = {
  title: 'Chọn rạp',
  id: null,
};

const DropdownHeader = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [pendingProvinceId, setPendingProvinceId] = useState(null);

  const {
    movieTheater = defaultMovieTheater,
    listMovieTheater = [],
    selectedProvince,
    hasCompletedInitialSelection,
  } = useSelector((state) => state.movieTheater ?? {});
  const { user } = useSelector((state) => state.user);

  const isReadOnly = user?.roles?.some((role) => role.roleId === 'RCP');

  const provinceGroups = useMemo(
    () =>
      Array.isArray(listMovieTheater)
        ? listMovieTheater.filter((item) => item?.submenu?.length > 0)
        : [],
    [listMovieTheater]
  );

  const pendingProvince = useMemo(() => {
    if (pendingProvinceId == null) {
      return provinceGroups[0] ?? null;
    }

    return (
      provinceGroups.find((province) => province.id === pendingProvinceId) ??
      null
    );
  }, [pendingProvinceId, provinceGroups]);

  const closeSetupWithDefault = () => {
    dispatch(completeMovieTheaterSelection());
    setIsSetupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsOpen(false);

      if (isSetupOpen) {
        closeSetupWithDefault();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dispatch, isSetupOpen]);

  useEffect(() => {
    if (provinceGroups.length === 0) {
      setIsSetupOpen(false);
      return;
    }

    if (selectedProvince?.id != null) {
      setPendingProvinceId((current) => current ?? selectedProvince.id);
    } else {
      setPendingProvinceId(
        (current) => current ?? provinceGroups[0]?.id ?? null
      );
    }
  }, [provinceGroups, selectedProvince?.id]);

  useEffect(() => {
    if (
      !hasCompletedInitialSelection &&
      provinceGroups.length > 0 &&
      !isReadOnly
    ) {
      setIsSetupOpen(true);
    }
  }, [hasCompletedInitialSelection, isReadOnly, provinceGroups.length]);

  useEffect(() => {
    if (isSetupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSetupOpen]);

  const handleSelectMovieTheater = (theater) => {
    dispatch(setMovieTheater(theater));
    setIsOpen(false);
  };

  const handleConfirmInitialSelection = (theater) => {
    dispatch(setMovieTheater(theater));
    setIsSetupOpen(false);
    setIsOpen(false);
  };

  const selectedLabel = isReadOnly
    ? user?.movieTheater?.name || defaultMovieTheater.title
    : movieTheater?.title || defaultMovieTheater.title;
  const selectedProvinceLabel = isReadOnly
    ? user?.movieTheater?.province?.name || selectedProvince?.title || ''
    : selectedProvince?.title || movieTheater?.provinceTitle || '';

  return (
    <>
      <div className="theater-picker" ref={dropdownRef}>
        <button
          type="button"
          className={`theater-picker__trigger ${isOpen ? 'is-open' : ''}`}
          onClick={() => {
            if (!isReadOnly) {
              setIsOpen((prev) => !prev);
            }
          }}
          aria-haspopup={isReadOnly ? undefined : 'listbox'}
          aria-expanded={isReadOnly ? undefined : isOpen}
        >
          <div className="theater-picker__trigger-copy">
            <span className="theater-picker__eyebrow">Chọn rạp của bạn</span>
            <span className="theater-picker__value">{selectedLabel}</span>
            {selectedProvinceLabel ? (
              <span className="theater-picker__meta">
                <LuMapPin size={14} />
                {selectedProvinceLabel}
              </span>
            ) : null}
          </div>
          {!isReadOnly && (
            <span className="theater-picker__chevron" aria-hidden="true">
              <LuChevronDown size={30} />
            </span>
          )}
        </button>

        {!isReadOnly && isOpen && (
          <div
            className="theater-picker__panel"
            role="listbox"
            aria-label="Chọn rạp theo tỉnh"
          >
            <div className="theater-picker__panel-scroll">
              {provinceGroups.length > 0 ? (
                provinceGroups.map((province) => (
                  <section className="theater-picker__group" key={province.id}>
                    <h3 className="theater-picker__group-title">
                      {province.title}
                    </h3>
                    <div className="theater-picker__group-list">
                      {province.submenu.map((theater) => {
                        const isSelected = theater?.id === movieTheater?.id;

                        return (
                          <button
                            key={theater.id}
                            type="button"
                            className={`theater-picker__option ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleSelectMovieTheater(theater)}
                          >
                            <span
                              className="theater-picker__option-check"
                              aria-hidden="true"
                            >
                              {isSelected ? <LuCheck size={24} /> : null}
                            </span>
                            <span className="theater-picker__option-copy">
                              <span className="theater-picker__option-name">
                                {theater.title}
                              </span>
                              <span className="theater-picker__option-province">
                                {province.title}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))
              ) : (
                <div className="theater-picker__empty">
                  Chưa có rạp khả dụng
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isReadOnly && isSetupOpen && pendingProvince && (
        <div className="theater-onboarding" role="dialog" aria-modal="true">
          <button
            type="button"
            className="theater-onboarding__backdrop"
            aria-label="Đóng và dùng rạp mặc định"
            onClick={closeSetupWithDefault}
          />
          <div className="theater-onboarding__dialog">
            <div className="theater-onboarding__header">
              <p className="theater-onboarding__eyebrow">
                Thiết lập rạp mặc định
              </p>
              <h2 className="theater-onboarding__title">
                Chọn tỉnh và rạp bạn muốn xem
              </h2>
              <p className="theater-onboarding__description">
                Lựa chọn này sẽ được dùng cho danh sách phim, lịch chiếu và đặt
                vé. Nếu bỏ qua, hệ thống sẽ tự chọn một rạp mặc định cho bạn.
              </p>
            </div>

            <div className="theater-onboarding__content">
              <div className="theater-onboarding__column">
                <p className="theater-onboarding__label">1. Chọn tỉnh</p>
                <div className="theater-onboarding__province-list">
                  {provinceGroups.map((province) => {
                    const isActive = province.id === pendingProvince?.id;

                    return (
                      <button
                        key={province.id}
                        type="button"
                        className={`theater-onboarding__province-item mt-2 ${isActive ? 'is-active' : ''}`}
                        onClick={() => setPendingProvinceId(province.id)}
                      >
                        <span>{province.title}</span>
                        <small>{province.submenu.length} rạp</small>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="theater-onboarding__column theater-onboarding__column--theaters">
                <p className="theater-onboarding__label">2. Chọn rạp</p>
                <div className="theater-onboarding__theater-list">
                  {pendingProvince.submenu.map((theater) => {
                    const isCurrent = theater?.id === movieTheater?.id;

                    return (
                      <button
                        key={theater.id}
                        type="button"
                        className={`theater-onboarding__theater-item mt-2 ${isCurrent ? 'is-current' : ''}`}
                        onClick={() => handleConfirmInitialSelection(theater)}
                      >
                        <span className="theater-onboarding__theater-name">
                          {theater.title}
                        </span>
                        <span className="theater-onboarding__theater-meta">
                          {pendingProvince.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="theater-onboarding__actions">
              <button
                type="button"
                className="theater-onboarding__secondary"
                onClick={closeSetupWithDefault}
              >
                Dùng rạp mặc định
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownHeader;

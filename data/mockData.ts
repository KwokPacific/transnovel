import { Book, Chapter, GlossaryTerm, Character, CharacterRelation } from '../types';

export const mockBooks: Book[] = [
  { id: '1', title: 'Đấu Phá Thương Khung', author: 'Thiên Tằm Thổ Đậu', genre: 'Tiên Hiệp', coverUrl: 'https://picsum.photos/seed/1/300/400' },
  { id: '2', title: 'Phàm Nhân Tu Tiên', author: 'Vong Ngữ', genre: 'Tiên Hiệp', coverUrl: 'https://picsum.photos/seed/2/300/400' },
  { id: '3', title: 'Toàn Chức Cao Thủ', author: 'Hồ Điệp Lam', genre: 'Võng Du', coverUrl: 'https://picsum.photos/seed/3/300/400' },
  { id: '4', title: 'Thần Mộ', author: 'Thần Đông', genre: 'Huyền Huyễn', coverUrl: 'https://picsum.photos/seed/4/300/400' },
];

export const mockChapters: Chapter[] = [
  { id: '101', bookId: '1', title: 'Chương 1: Thiên tài vẫn lạc', originalContent: '“斗之力，三段！”\n\n望着测验魔石碑上面闪亮得甚至有些刺眼的五个大字，少年面无表情，唇角有着一抹自嘲，紧握的手掌，因为大力，而导致略微尖锐的指甲深深的刺进了掌心之中，带来一阵阵钻心的疼痛…', translatedContent: '' },
  { id: '102', bookId: '1', title: 'Chương 2: Khách nhân', originalContent: '翌日，当第一缕晨辉倾洒在萧家庄园时，那紧闭了一夜的庄园大门，便是被缓缓打开，旋即，一队队身着劲装的护卫，有条不紊的涌泉而出，然后分部在庄园的各个出口，开始了新一天的防御工作。', translatedContent: 'Ngày hôm sau, khi những tia nắng ban mai đầu tiên chiếu rọi trang viên Tiêu gia, cánh cổng lớn đã đóng chặt suốt đêm cũng từ từ mở ra. Ngay sau đó, từng đội hộ vệ mặc trang phục gọn gàng, trật tự tuôn ra như suối, rồi phân bố ở các lối ra của trang viên, bắt đầu công việc phòng ngự cho một ngày mới.' },
];

export const mockGlossary: GlossaryTerm[] = [
    { id: 'g1', original: '斗气', translation: 'Đấu Khí', bookId: '1' },
    { id: 'g2', original: '魂殿', translation: 'Hồn Điện', bookId: '1' },
    { id: 'g3', original: '魔兽', translation: 'Ma Thú', bookId: '1' },
    { id: 'g4', original: '炼药师', translation: 'Luyện Dược Sư', bookId: '1' },
    { id: 'g5', original: 'Thất Huyền Môn', translation: 'Thất Huyền Môn', bookId: '2' },
    { id: 'g6', original: 'Hàn Lập', translation: 'Hàn Lập', bookId: '2' },
    { id: 'g7', original: 'Quân Mạc Tiếu', translation: 'Quân Mạc Tiếu', bookId: '3' },
];

export const mockCharacters: Character[] = [
    { id: 'c1', name_cn: '萧炎', name_vi: 'Tiêu Viêm', alias: 'Viêm Đế', notes: 'Nhân vật chính, ban đầu là thiên tài sau đó trở thành phế vật, có ý chí kiên cường.', address_3rd: 'thiếu niên' },
    { id: 'c2', name_cn: '纳兰嫣然', name_vi: 'Nạp Lan Yên Nhiên', alias: 'Vân Lam Tông Thiếu Tông Chủ', notes: 'Hôn thê của Tiêu Viêm, chủ động từ hôn.', address_3rd: 'cô gái' },
    { id: 'c3', name_cn: '药尘', name_vi: 'Dược Trần', alias: 'Dược Lão', notes: 'Luyện dược sư số một đại lục, tồn tại dưới dạng linh hồn trong chiếc nhẫn của Tiêu Viêm.', address_3rd: 'lão giả' },
];

export const mockRelations: CharacterRelation[] = [
    { id: 'r1', from: 'c1', to: 'c3', address: 'lão sư' },
    { id: 'r2', from: 'c2', to: 'c1', address: 'Tiêu Viêm' },
];
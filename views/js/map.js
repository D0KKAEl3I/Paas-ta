userLocation = { // 기본 좌표 설정 서울디지텍고등학교
    latitude: 37.5389694235589, // 위도
    longitude: 126.990617730566 // 경도
};

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성

function setCenter(latitude, longitude) {
    // 이동할 위도 경도 위치를 생성
    var moveLatLon = new kakao.maps.LatLng(latitude, longitude);

    // 지도 중심을 이동
    map.setCenter(moveLatLon);
}

function getPositionErrorHandle() { // 임의로 만든 에러 핸들러, 내 위치 확인 요청에서 차단 또는 거절을 눌렀을 때 작동
    alert("손쉽게 내 주변 흡연구역을 확인하시려면 F5를 누르신 다음, 위치정보 이용에 동의해주세요."); // 에러 alert
}

if (navigator.geolocation) { // 위치정보를 가져올 수 있는지 확인
    navigator.geolocation.getCurrentPosition(position => {
        // 가져온 위치 정보를 userLocation에 저장
        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;

        // 위의 setCenter 함수를 호출하여 새로운 위도, 경도로 지도의 중심좌표를 변경
        setCenter(userLocation.latitude, userLocation.longitude);
    }, getPositionErrorHandle)
}

// 마커 이미지의 이미지 주소
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
// 마커들이 저장될 배열
var markers = []

// 마커를 생성하는 반복문
axios.get('/findPlace').then(r=>{
    r.data.forEach(item => {
    // 마커 이미지의 이미지 크기
    var imageSize = new kakao.maps.Size(24, 35);

    // 마커 이미지 생성
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커 생성
    let marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(item.lat, item.lon), // 마커를 표시할 위치
        title: item.placeName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀 표시
        image: markerImage, // 마커 이미지
        clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });

    // 마커에 클릭이벤트를 등록
    kakao.maps.event.addListener(marker, 'click', function () {
        // 팝업에 들어갈 데이터
        console.log(item);
        alert(item.placeName)
        // 마커
        // markers[i] 또는 this를 사용하여 마커 불러오기
        // 이 곳에서 화면에 오버레이할 구문을 넣등가 하셈
    });
    markers.push(marker);
    });
})

function closePopup() {
    // 팝업을 닫는 함수 
}


// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
// marker.setMap(null);
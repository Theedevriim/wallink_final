module contract::contract;

use std::string::{Self, String};
use std::vector;
use sui::display;
use sui::package;   
use sui::event;
use sui::dynamic_field;
use sui::hex;


// OTW for display
public struct CONTRACT has drop {}

public struct Person has key, store {  // key eklendi NFT olması için
    id: UID,
    name: String,
    age: u8,
    image_url: String,
    links: vector<String>,
    hexaddr: String,  // Flatland tarzı hex adresi ekliyoruz
}

// Dynamic fields için yeni structlar - mevcut yapıyı bozmadan
public struct ProfileLinksKey has copy, drop, store {}
public struct ProfileMetaKey has copy, drop, store {}

public struct DynamicLinks has store {
    social_links: vector<String>,
    link_titles: vector<String>,
    link_types: vector<String>,
}

public struct DynamicMeta has store {
    bio: String,
    website: String,
    location: String,
    created_at: u64,
}

public struct PersonMetadata has copy, drop {
    id: u64,
    creator: address,
    timestamp: u64,
}

// Display setup function - Flatland'deki init fonksiyonunun adaptasyonu
fun init(otw: CONTRACT, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);
    let mut display = display::new<Person>(&publisher, ctx);

    // Person için metadata displayi
    display.add(
        string::utf8(b"name"),
        string::utf8(b"{name}"),
    );
    display.add(
        string::utf8(b"description"), 
        string::utf8(b"A Person Profile with {name}, age {age}"),
    );
    display.add(
        string::utf8(b"image_url"),
        string::utf8(b"{image_url}"),
    );
    display.add(
        string::utf8(b"external_url"),
        string::utf8(b"https://wallink.trwal.app/profile/{id}"),
    );
    // Flatland tarzı link ekleme - mevcut yapıya entegre
    display.add(
        b"link".to_string(),
        b"https://wallink.trwal.app/0x{hexaddr}".to_string(),
    );
    // Dynamic links için bir alan - JSON formatında
    display.add(
        string::utf8(b"attributes"),
        string::utf8(b"[{\"trait_type\":\"Age\",\"value\":{age}},{\"trait_type\":\"Links Count\",\"value\":\"{links_count}\"}]"),
    );
    display.update_version();

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}

public fun create_person(
    name: String,
    age: u8,
    image_url: String,
    links: vector<String>,
    ctx: &mut TxContext  // TxContext eklendi
): Person {
    let id = object::new(ctx);
    let hexaddr = hex::encode(object::uid_to_bytes(&id)).to_string();  // Flatland tarzı hex
    
    let mut person = Person {
        id,  // UID oluşturma
        name,
        age,
        image_url,
        links,
        hexaddr,
    };
    
    // Dynamic fields ekleme - profili dynamic hale getiriyoruz
    let dynamic_links = DynamicLinks {
        social_links: vector::empty(),
        link_titles: vector::empty(),
        link_types: vector::empty(),
    };
    
    let dynamic_meta = DynamicMeta {
        bio: string::utf8(b""),
        website: string::utf8(b""),
        location: string::utf8(b""),
        created_at: tx_context::epoch_timestamp_ms(ctx),
    };
    
    // Dynamic fields attach ediyoruz
    dynamic_field::add(&mut person.id, ProfileLinksKey {}, dynamic_links);
    dynamic_field::add(&mut person.id, ProfileMetaKey {}, dynamic_meta);
    
    person
}

// Entry function - kullanıcıların çağırabileceği
entry fun mint_person(
    name: String,
    age: u8,
    image_url: String,
    links: vector<String>,
    ctx: &mut TxContext
) {
    let person = create_person(name, age, image_url, links, ctx);
    transfer::transfer(person, tx_context::sender(ctx));
}

// Yeni fonksiyon: Mevcut Person'a link ekleme
public fun add_link_to_person(person: &mut Person, new_link: String) {
    vector::push_back(&mut person.links, new_link);
}

// Yeni fonksiyon: Person'dan link silme
public fun remove_link_from_person(person: &mut Person, index: u64) {
    assert!(index < vector::length(&person.links), 0); // Index kontrolü
    vector::remove(&mut person.links, index);
}

// Yeni fonksiyon: Tüm linkleri alma
public fun get_all_links(person: &Person): &vector<String> {
    &person.links
}

// Yeni fonksiyon: Belirli bir index'teki linki alma
public fun get_link_at_index(person: &Person, index: u64): &String {
    assert!(index < vector::length(&person.links), 0); // Index kontrolü
    vector::borrow(&person.links, index)
}

// DYNAMIC FIELDS YÖNETİMİ - Yeni dynamic özellikler
// Dynamic social link ekleme
entry fun add_social_link(
    person: &mut Person, 
    link: String, 
    title: String, 
    link_type: String
) {
    let dynamic_links = dynamic_field::borrow_mut<ProfileLinksKey, DynamicLinks>(&mut person.id, ProfileLinksKey {});
    vector::push_back(&mut dynamic_links.social_links, link);
    vector::push_back(&mut dynamic_links.link_titles, title);
    vector::push_back(&mut dynamic_links.link_types, link_type);
}

// Dynamic bio güncelleme
entry fun update_bio(person: &mut Person, new_bio: String) {
    let dynamic_meta = dynamic_field::borrow_mut<ProfileMetaKey, DynamicMeta>(&mut person.id, ProfileMetaKey {});
    dynamic_meta.bio = new_bio;
}

// Dynamic website güncelleme
entry fun update_website(person: &mut Person, website: String) {
    let dynamic_meta = dynamic_field::borrow_mut<ProfileMetaKey, DynamicMeta>(&mut person.id, ProfileMetaKey {});
    dynamic_meta.website = website;
}

// Dynamic location güncelleme
entry fun update_location(person: &mut Person, location: String) {
    let dynamic_meta = dynamic_field::borrow_mut<ProfileMetaKey, DynamicMeta>(&mut person.id, ProfileMetaKey {});
    dynamic_meta.location = location;
}

// Dynamic fields okuma fonksiyonları
public fun get_dynamic_links(person: &Person): &DynamicLinks {
    dynamic_field::borrow<ProfileLinksKey, DynamicLinks>(&person.id, ProfileLinksKey {})
}

public fun get_dynamic_meta(person: &Person): &DynamicMeta {
    dynamic_field::borrow<ProfileMetaKey, DynamicMeta>(&person.id, ProfileMetaKey {})
}

// Test fonksiyonları için getter'lar
public fun get_person_name(person: &Person): &String {
    &person.name
}

public fun get_person_age(person: &Person): u8 {
    person.age
}

public fun get_person_hexaddr(person: &Person): &String {
    &person.hexaddr
}

public fun get_person_image_url(person: &Person): &String {
    &person.image_url
}

#pragma once

namespace proton {
  typedef std::variant<std::string, uint64_t, double> data_variant;

  struct BotEntry {
    uint64_t bot_index;
    data_variant data;

    EOSLIB_SERIALIZE ( BotEntry, (bot_index)(data) )
  };

  static inline eosio::checksum256 get_txid () {
    auto size = eosio::transaction_size();
    char buf[size];
    uint32_t read = eosio::read_transaction(buf, size);
    eosio::check( size == read, "read_transaction failed");
    return eosio::sha256(buf, size);
  }

  struct Tx {
    eosio::checksum256 id;
    eosio::time_point time;
    data_variant data;

    EOSLIB_SERIALIZE ( Tx, (id)(time)(data) )
  };

  struct [[eosio::table, eosio::contract("atom")]] Bot {
    uint64_t index;
    eosio::name account;
    std::string description;
    eosio::name oracle_contract;
    uint64_t feed_index;
    std::map<uint8_t, uint64_t> tx_count_by_utc_hour;
    uint8_t max_history;
    std::vector<Tx> history;

    uint64_t primary_key() const { return index; };

    EOSLIB_SERIALIZE ( Bot, (index)(account)(description)
                            (oracle_contract)(feed_index)
                            (tx_count_by_utc_hour)(max_history)(history) )
  };
  typedef eosio::multi_index<"bots"_n, Bot> bots_table;
}